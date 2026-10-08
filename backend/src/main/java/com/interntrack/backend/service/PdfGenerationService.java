package com.interntrack.backend.service;
import com.interntrack.backend.model.entity.Certificate;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;

@Service
public class PdfGenerationService {

    public byte[] generateCertificatePdf(Certificate certificate) {
        Document document = new Document(PageSize.A4.rotate(), 50, 50, 50, 50);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Fonts
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 36, Font.BOLD, java.awt.Color.decode("#6D4AFF"));
            Font subtitleFont = FontFactory.getFont(FontFactory.HELVETICA, 18, Font.NORMAL, java.awt.Color.DARK_GRAY);
            Font nameFont = FontFactory.getFont(FontFactory.TIMES_BOLDITALIC, 32, Font.NORMAL, java.awt.Color.BLACK);
            Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 14, Font.NORMAL, java.awt.Color.DARK_GRAY);
            Font codeFont = FontFactory.getFont(FontFactory.COURIER, 10, Font.NORMAL, java.awt.Color.GRAY);

            document.add(new Paragraph("\n\n"));

            Paragraph title = new Paragraph("CERTIFICATE OF COMPLETION", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            
            document.add(new Paragraph("\n"));
            
            Paragraph subtitle = new Paragraph("This is to certify that", subtitleFont);
            subtitle.setAlignment(Element.ALIGN_CENTER);
            document.add(subtitle);
            
            document.add(new Paragraph("\n"));
            
            Paragraph name = new Paragraph(certificate.getStudent().getUser().getName(), nameFont);
            name.setAlignment(Element.ALIGN_CENTER);
            document.add(name);
            
            document.add(new Paragraph("\n"));
            
            Paragraph body = new Paragraph("has successfully completed the " + certificate.getReferenceType() + "\n" +
                    "\"" + certificate.getProgramTitle() + "\"\n" +
                    "at " + certificate.getOrganization().getCompanyName() + ".", bodyFont);
            body.setAlignment(Element.ALIGN_CENTER);
            document.add(body);
            
            document.add(new Paragraph("\n\n\n"));
            
            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);
            
            PdfPCell dateCell = new PdfPCell(new Phrase("Date: " + certificate.getIssueDate(), bodyFont));
            dateCell.setBorder(Rectangle.NO_BORDER);
            dateCell.setHorizontalAlignment(Element.ALIGN_LEFT);
            table.addCell(dateCell);
            
            PdfPCell signCell = new PdfPCell(new Phrase("Authorized Signatory\n" + certificate.getOrganization().getCompanyName(), bodyFont));
            signCell.setBorder(Rectangle.NO_BORDER);
            signCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            table.addCell(signCell);
            
            document.add(table);
            
            document.add(new Paragraph("\n\n\n"));
            Paragraph code = new Paragraph("Verification Code: " + certificate.getVerificationCode(), codeFont);
            code.setAlignment(Element.ALIGN_CENTER);
            document.add(code);

        } catch (DocumentException e) {
            throw new RuntimeException("Error generating PDF", e);
        } finally {
            document.close();
        }

        return out.toByteArray();
    }
}
