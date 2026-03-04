import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportProposalToPDF = (proposal, formatCurrency) => {
    const doc = new jsPDF();

    // Colors
    const primaryColor = [16, 185, 129]; // #10b981
    const darkColor = [31, 41, 55]; // #1f2937
    const grayColor = [107, 114, 128]; // #6b7280

    // Helper to add centered title
    const addTitle = (text, y) => {
        doc.setFontSize(22);
        doc.setTextColor(...primaryColor);
        doc.setFont('helvetica', 'bold');
        doc.text(text, 14, y);
    };

    // Header
    addTitle('B2B Sustainable Commerce Proposal', 20);

    // Client Info
    doc.setFontSize(12);
    doc.setTextColor(...darkColor);
    doc.text(`Prepared for: ${proposal.clientName}`, 14, 32);
    doc.text(`Total Budget: ${formatCurrency(proposal.totalBudget)}`, 14, 38);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...grayColor);
    const splitDate = new Date().toLocaleDateString();
    doc.text(`Date: ${splitDate}`, 150, 32);

    // Sustainability Goals
    doc.setFontSize(14);
    doc.setTextColor(...darkColor);
    doc.setFont('helvetica', 'bold');
    doc.text('Sustainability Goals', 14, 50);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...grayColor);
    const splitGoals = doc.splitTextToSize(proposal.sustainabilityGoals, 180);
    doc.text(splitGoals, 14, 58);

    let currentY = 58 + (splitGoals.length * 5) + 5;

    // Impact Summary
    if (proposal.impactPositioningSummary) {
        doc.setFontSize(14);
        doc.setTextColor(...primaryColor);
        doc.setFont('helvetica', 'bold');
        doc.text('Environmental Impact Summary', 14, currentY);

        const impact = proposal.impactPositioningSummary;
        const impactData = [
            ['Metric', 'Value'],
            ['Plastic Saved', `${impact.plasticSavedKg} kg`],
            ['Carbon Offset', `${impact.carbonOffsetKg} kg CO2`],
            ['Trees Equivalent', `${impact.treesEquivalent} trees`],
            ['Water Saved', `${impact.waterSavedLiters} liters`]
        ].filter(row => !row[1].includes('undefined'));

        if (impactData.length > 1) {
            autoTable(doc, {
                startY: currentY + 5,
                head: [impactData[0]],
                body: impactData.slice(1),
                theme: 'grid',
                headStyles: { fillColor: primaryColor, textColor: [255, 255, 255] },
                styles: { fontSize: 10, cellPadding: 3 },
            });

            currentY = doc.lastAutoTable.finalY;
        }

        // Add Key Message
        if (impact.keyMessage) {
            const impactY = currentY + 10;
            doc.setFontSize(11);
            doc.setFont('helvetica', 'italic');
            doc.setTextColor(...darkColor);
            const splitMsg = doc.splitTextToSize(`"${impact.keyMessage}"`, 180);
            doc.text(splitMsg, 14, impactY);
            currentY = impactY + (splitMsg.length * 5) + 10;
        } else {
            currentY = currentY + 15;
        }
    }

    // Products Table
    doc.addPage();
    addTitle('Recommended Products', 20);
    currentY = 35;

    const productData = [];
    proposal.productMix?.forEach(category => {
        productData.push([{ content: category.category, colSpan: 5, styles: { fillColor: [243, 244, 246], fontStyle: 'bold', textColor: [31, 41, 55] } }]);
        category.products?.forEach(p => {
            productData.push([
                p.name,
                p.sustainabilityFeature,
                p.quantity?.toString() || '',
                formatCurrency(p.unitPrice || 0),
                formatCurrency(p.totalPrice || 0)
            ]);
        });
    });

    if (productData.length > 0) {
        autoTable(doc, {
            startY: currentY,
            head: [['Product', 'Eco Feature', 'Qty', 'Unit Price', 'Total']],
            body: productData,
            theme: 'striped',
            headStyles: { fillColor: darkColor, textColor: [255, 255, 255] },
            styles: { fontSize: 9 },
            columnStyles: {
                0: { cellWidth: 50 },
                1: { cellWidth: 50 },
                2: { halign: 'center' },
                3: { halign: 'right' },
                4: { halign: 'right' }
            }
        });
        currentY = doc.lastAutoTable.finalY + 15;
    }

    // Budget Summary
    doc.setFontSize(14);
    doc.setTextColor(...darkColor);
    doc.setFont('helvetica', 'bold');
    doc.text('Budget Summary', 14, currentY);

    const totalAllocated = proposal.costBreakdown?.reduce((acc, item) => acc + (item.allocatedAmount || 0), 0) || 0;
    const savedMoney = proposal.totalBudget - totalAllocated;

    const budgetData = [
        ['Total Budget', formatCurrency(proposal.totalBudget)],
        ['Total Allocated', formatCurrency(totalAllocated)],
        ['Money Saved', formatCurrency(savedMoney)]
    ];

    autoTable(doc, {
        startY: currentY + 5,
        body: budgetData,
        theme: 'plain',
        styles: { fontSize: 11, fontStyle: 'bold' },
        columnStyles: {
            0: { cellWidth: 100 },
            1: { cellWidth: 80, halign: 'right', textColor: primaryColor }
        }
    });

    // Save PDF
    doc.save(`Rayeva_Proposal_${proposal.clientName.replace(/\s+/g, '_')}.pdf`);
};
