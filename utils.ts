import { Sale, SaleDetail, Payment, Installment, PendingPayment } from './types';

// --- Helper Functions ---
const parseCurrency = (value: string): number => {
    if (typeof value !== 'string' || value.trim() === '-' || value.trim() === '') {
        return 0;
    }
    const numberValue = parseFloat(value.replace(/S\/\s*/, ''));
    return isNaN(numberValue) ? 0 : numberValue;
};

const parseDateFromString = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split(' ')[0].split('/').map(Number);
    return new Date(year, month - 1, day);
};

// --- Data Derivation Functions ---

export const deriveSalesSummary = (saleDetails: SaleDetail[]): Sale[] => {
    return saleDetails.map(detail => {
        const [date, time] = detail.dateTime.split(' ');
        return {
            id: detail.id,
            seller: detail.seller,
            date: date,
            time: time,
            amount: detail.total,
            status: detail.status,
        };
    });
};

export const derivePaidPayments = (saleDetails: SaleDetail[]): Payment[] => {
    const allPaidInstallmentsRaw: Installment[] = [];

    saleDetails.forEach(sale => {
        if (!sale.payments || sale.payments.length === 0) {
            return;
        }

        const saleDate = parseDateFromString(sale.dateTime);

        sale.payments.forEach(paymentRecord => {
            const installmentNumber = paymentRecord.installmentNumber;
            const dueDate = new Date(saleDate);
            // Due date is calculated as months after the initial sale date
            dueDate.setMonth(saleDate.getMonth() + (installmentNumber - 1));

            const installment: Installment = {
                dueDate: dueDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
                amount: paymentRecord.amount,
                paymentMethod: paymentRecord.paymentMethod,
                isPaid: true,
                paymentDate: paymentRecord.paymentDate,
                installmentNumber: installmentNumber,
                totalInstallments: sale.totalInstallments || 1,
                saleId: sale.id,
                payerName: paymentRecord.payerName,
            };
            allPaidInstallmentsRaw.push(installment);
        });
    });

    // Sort by payment date to assign sequential IDs
    allPaidInstallmentsRaw.sort((a, b) => {
        const dateA = parseDateFromString(a.paymentDate!);
        const dateB = parseDateFromString(b.paymentDate!);
        if (dateA.getTime() === dateB.getTime()) {
            return a.saleId.localeCompare(b.saleId); // Stable sort for same-day payments
        }
        return dateA.getTime() - dateB.getTime();
    });

    // Assign IDs and then re-sort for display (most recent first)
    const chronologicallyOrderedPayments: Payment[] = allPaidInstallmentsRaw.map((inst, index) => ({
        id: `PG-${String(index + 1).padStart(3, '0')}`,
        saleId: inst.saleId,
        installment: inst,
    }));

    return chronologicallyOrderedPayments.reverse();
};

export const derivePendingPayments = (saleDetails: SaleDetail[]): PendingPayment[] => {
    return saleDetails
        .filter(sale => 
            sale.paymentCondition === 'CRÉDITO' && 
            sale.totalInstallments && 
            sale.paidInstallments !== undefined && 
            sale.paidInstallments < sale.totalInstallments
        )
        .flatMap(sale => {
            const totalAmount = parseCurrency(sale.total);
            const totalInstallments = sale.totalInstallments!;
            const paidInstallments = sale.paidInstallments!;
            const standardInstallment = parseFloat((totalAmount / totalInstallments).toFixed(2));
            const saleDate = parseDateFromString(sale.dateTime);
            
            const pendingInstallmentsDetails: PendingPayment[] = [];

            // Generate all pending installments from the next due one to the last one
            for (let i = paidInstallments + 1; i <= totalInstallments; i++) {
                const installmentNumber = i;
                
                const dueDate = new Date(saleDate);
                dueDate.setMonth(saleDate.getMonth() + (installmentNumber - 1));

                const isLastInstallment = installmentNumber === totalInstallments;
                const amount = isLastInstallment
                    ? totalAmount - (standardInstallment * (totalInstallments - 1))
                    : standardInstallment;

                const installment: Installment = {
                    dueDate: dueDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
                    amount: `S/${amount.toFixed(2)}`,
                    paymentMethod: '-',
                    isPaid: false,
                    installmentNumber: installmentNumber,
                    totalInstallments,
                    saleId: sale.id,
                };

                pendingInstallmentsDetails.push({
                    saleId: sale.id,
                    clientName: sale.client,
                    installment: installment,
                });
            }
            
            return pendingInstallmentsDetails;
        });
};