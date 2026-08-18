import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export const generateAgreement = (booking, vehicle, customer) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            
            // Ensure uploads directory exists
            const uploadsDir = path.join(process.cwd(), 'uploads', 'agreements');
            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
            }

            const fileName = `agreement_${booking._id}.pdf`;
            const filePath = path.join(uploadsDir, fileName);
            
            const writeStream = fs.createWriteStream(filePath);
            doc.pipe(writeStream);

            // Header
            doc.fontSize(20).text('Vehicle Rental Agreement', { align: 'center' });
            doc.moveDown();
            
            // Details
            doc.fontSize(12).text(`Agreement Date: ${new Date().toLocaleDateString()}`);
            doc.moveDown();

            doc.text('Customer Details:', { underline: true });
            doc.text(`Name: ${customer.name}`);
            doc.text(`Email: ${customer.email}`);
            doc.moveDown();

            doc.text('Vehicle Details:', { underline: true });
            doc.text(`Brand & Model: ${vehicle.brand} ${vehicle.model}`);
            doc.text(`Registration: ${vehicle.registrationNumber}`);
            doc.moveDown();

            doc.text('Rental Period:', { underline: true });
            doc.text(`From: ${new Date(booking.startDate).toLocaleDateString()}`);
            doc.text(`To: ${new Date(booking.endDate).toLocaleDateString()}`);
            doc.moveDown();

            doc.text('Charges:', { underline: true });
            doc.text(`Total Amount: $${booking.totalAmount}`);
            doc.text(`Security Deposit: $${booking.depositAmount}`);
            doc.moveDown();

            doc.text('Terms and Conditions:', { underline: true });
            doc.text('1. The renter agrees to return the vehicle in the same condition as received.');
            doc.text('2. The renter is responsible for any damage or traffic violations during the rental period.');
            doc.moveDown(3);

            doc.text('_______________________                                _______________________');
            doc.text('Customer Signature                                     Manager Signature');

            doc.end();

            writeStream.on('finish', () => {
                resolve(`/uploads/agreements/${fileName}`);
            });
            writeStream.on('error', (err) => {
                reject(err);
            });
        } catch (error) {
            reject(error);
        }
    });
};
