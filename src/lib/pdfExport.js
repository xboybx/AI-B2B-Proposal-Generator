import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ── Color palette ────────────────────────────────────────────────────────────
const C = {
    primary: [16, 185, 129],   // emerald-500
    primaryDk: [4, 120, 87],    // emerald-700
    dark: [17, 24, 39],    // gray-900
    mid: [55, 65, 81],    // gray-700
    muted: [107, 114, 128],  // gray-500
    light: [243, 244, 246],  // gray-100
    border: [209, 213, 219],  // gray-300
    white: [255, 255, 255],
    accent: [14, 165, 233],   // sky-500
    green: [22, 163, 74],    // green-600
    blue: [37, 99, 235],    // blue-600
    cyan: [8, 145, 178],    // cyan-600
};

// ── Helpers ──────────────────────────────────────────────────────────────────
const px = (doc, hex) => typeof hex === 'string'
    ? doc.setTextColor(hex)
    : doc.setTextColor(...hex);

function sectionTitle(doc, text, y) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    px(doc, C.primaryDk);
    doc.text(text.toUpperCase(), 14, y);
    doc.setDrawColor(...C.primary);
    doc.setLineWidth(0.8);
    doc.line(14, y + 2, 196, y + 2);
    return y + 10;
}

function checkY(doc, y, needed = 30) {
    if (y + needed > 275) {
        doc.addPage();
        return 20;
    }
    return y;
}

// ── Cover page ───────────────────────────────────────────────────────────────
function addCoverPage(doc, proposal, formatCurrency) {
    // Dark header band
    doc.setFillColor(...C.dark);
    doc.rect(0, 0, 210, 65, 'F');

    // Company name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    px(doc, C.primary);
    doc.text('RAYEVA', 14, 28);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    px(doc, C.border);
    doc.text('Sustainable Commerce Platform', 14, 36);

    // Right side: "PROPOSAL"
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    px(doc, C.white);
    doc.text('B2B PROPOSAL', 196, 28, { align: 'right' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    px(doc, C.border);
    doc.text(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), 196, 36, { align: 'right' });

    // Green accent line
    doc.setFillColor(...C.primary);
    doc.rect(0, 65, 210, 3, 'F');

    // Prepared for block
    let y = 88;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    px(doc, C.muted);
    doc.text('PREPARED FOR', 14, y);

    y += 7;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    px(doc, C.dark);
    doc.text(proposal.clientName, 14, y);

    y += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    px(doc, C.muted);
    doc.text('Sustainability-focused B2B Product Proposal', 14, y);

    // Divider
    y += 12;
    doc.setDrawColor(...C.border);
    doc.setLineWidth(0.4);
    doc.line(14, y, 196, y);
    y += 12;

    // Key stats row
    const stats = [
        { label: 'Total Budget', value: formatCurrency(proposal.totalBudget) },
        { label: 'Product Categories', value: (proposal.productMix?.length || 0).toString() },
        { label: 'Total Products', value: (proposal.productMix?.reduce((a, c) => a + (c.products?.length || 0), 0) || 0).toString() },
        { label: 'Delivery Timeline', value: proposal.timeline || 'TBD' },
    ];

    const colW = 181 / stats.length;
    stats.forEach((s, i) => {
        const x = 14 + i * colW;
        doc.setFillColor(...C.light);
        doc.roundedRect(x, y, colW - 4, 28, 2, 2, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        px(doc, C.primaryDk);
        doc.text(s.value, x + (colW - 4) / 2, y + 11, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        px(doc, C.muted);
        doc.text(s.label, x + (colW - 4) / 2, y + 22, { align: 'center' });
    });

    y += 40;

    // Sustainability Goals
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    px(doc, C.mid);
    doc.text('SUSTAINABILITY GOALS', 14, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    px(doc, C.dark);
    const goals = doc.splitTextToSize(proposal.sustainabilityGoals || '', 180);
    doc.text(goals, 14, y);
    y += goals.length * 5 + 8;

    // Key Message box
    if (proposal.impactPositioningSummary?.keyMessage) {
        doc.setFillColor(...C.primary);
        doc.roundedRect(12, y, 184, 22, 3, 3, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        px(doc, C.white);
        doc.text('>> IMPACT HIGHLIGHT', 14, y + 7);
        doc.setFont('helvetica', 'normal');
        const msg = doc.splitTextToSize(proposal.impactPositioningSummary.keyMessage, 176);
        doc.text(msg, 14, y + 14);
        y += 32;
    }

    // Additional Notes
    if (proposal.notes) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9);
        px(doc, C.muted);
        const notes = doc.splitTextToSize(`Note: ${proposal.notes}`, 180);
        doc.text(notes, 14, y);
    }

    // Footer
    doc.setFillColor(...C.dark);
    doc.rect(0, 278, 210, 19, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    px(doc, C.muted);
    doc.text('Confidential — Rayeva Sustainable Commerce Platform', 14, 288);
    doc.text('Page 1', 196, 288, { align: 'right' });
}

// ── Products page ─────────────────────────────────────────────────────────────
function addProductsPage(doc, proposal, formatCurrency) { // No emoji in labels
    doc.addPage();
    let y = 20;
    y = sectionTitle(doc, 'RECOMMENDED PRODUCTS', y);

    proposal.productMix?.forEach((category) => {
        y = checkY(doc, y, 15);

        // Category header
        doc.setFillColor(...C.dark);
        doc.roundedRect(12, y - 5, 184, 10, 2, 2, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        px(doc, C.white);
        doc.text(category.category.toUpperCase(), 16, y + 1);
        y += 10;

        const rows = (category.products || []).map((p, idx) => [
            `${idx + 1}. ${p.name}`,
            p.description || '-',
            p.sustainabilityFeature || '-',
            String(p.quantity || 0),
            formatCurrency(p.unitPrice || 0),
            formatCurrency(p.totalPrice || 0),
        ]);

        autoTable(doc, {
            startY: y,
            head: [['Product', 'Description', 'Eco Feature', 'Qty', 'Unit Price', 'Total']],
            body: rows,
            theme: 'grid',
            headStyles: {
                fillColor: C.mid,
                textColor: C.white,
                fontSize: 8,
                fontStyle: 'bold',
                cellPadding: 3,
            },
            bodyStyles: { fontSize: 8, cellPadding: 3, textColor: C.dark },
            alternateRowStyles: { fillColor: C.light },
            columnStyles: {
                0: { cellWidth: 38, fontStyle: 'bold' },
                1: { cellWidth: 50 },
                2: { cellWidth: 38, textColor: C.green },
                3: { cellWidth: 12, halign: 'center' },
                4: { cellWidth: 22, halign: 'right' },
                5: { cellWidth: 22, halign: 'right', fontStyle: 'bold', textColor: C.primaryDk },
            },
            margin: { left: 12, right: 12 },
        });

        y = doc.lastAutoTable.finalY + 8;
    });
}

// ── Budget page ────────────────────────────────────────────────────────────────
function addBudgetPage(doc, proposal, formatCurrency) {
    doc.addPage();
    let y = 20;
    y = sectionTitle(doc, 'BUDGET ANALYSIS', y);

    const totalAllocated = proposal.costBreakdown?.reduce((a, i) => a + (i.allocatedAmount || 0), 0) || 0;
    const moneySaved = proposal.totalBudget - totalAllocated;

    // Summary cards
    const summaryItems = [
        { label: 'Total Budget', value: formatCurrency(proposal.totalBudget), color: C.blue },
        { label: 'Total Allocated', value: formatCurrency(totalAllocated), color: C.primary },
        { label: '🎉 Money Saved', value: formatCurrency(moneySaved), color: C.green },
    ];
    const cardW = 57;
    summaryItems.forEach((item, i) => {
        const x = 14 + i * (cardW + 5);
        doc.setFillColor(...C.light);
        doc.roundedRect(x, y, cardW, 26, 3, 3, 'F');
        doc.setDrawColor(...item.color);
        doc.setLineWidth(2);
        doc.line(x, y, x, y + 26);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        px(doc, item.color);
        doc.text(item.value, x + cardW / 2, y + 11, { align: 'center' });
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        px(doc, C.muted);
        doc.text(item.label, x + cardW / 2, y + 20, { align: 'center' });
    });
    y += 36;

    // Cost Breakdown with progress bars
    if (proposal.costBreakdown?.length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        px(doc, C.mid);
        doc.text('Cost Breakdown by Category', 14, y);
        y += 7;

        proposal.costBreakdown.forEach((item) => {
            y = checkY(doc, y, 14);
            const pct = Math.min(item.percentageOfBudget || 0, 100);
            const barWidth = 110;

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            px(doc, C.dark);
            doc.text(item.category, 14, y);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            px(doc, C.muted);
            doc.text(`${formatCurrency(item.allocatedAmount)} (${pct}%)`, 196, y, { align: 'right' });

            // Bar background
            y += 3;
            doc.setFillColor(...C.border);
            doc.roundedRect(14, y, barWidth, 5, 1, 1, 'F');
            // Bar fill
            doc.setFillColor(...C.primary);
            if (pct > 0) doc.roundedRect(14, y, (barWidth * pct) / 100, 5, 1, 1, 'F');

            y += 11;
        });
        y += 4;
    }

    // Budget Allocation Table
    if (proposal.budgetAllocation) {
        y = checkY(doc, y, 20);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        px(doc, C.mid);
        doc.text('Budget Allocation by Category', 14, y);
        y += 4;

        const rows = Object.entries(proposal.budgetAllocation).map(([key, val]) => [
            key.replace(/([A-Z])/g, ' $1').trim().replace(/\b\w/g, (c) => c.toUpperCase()),
            formatCurrency(val),
        ]);

        autoTable(doc, {
            startY: y,
            head: [['Category', 'Amount']],
            body: rows,
            theme: 'striped',
            headStyles: { fillColor: C.mid, textColor: C.white, fontSize: 9 },
            bodyStyles: { fontSize: 9, textColor: C.dark, cellPadding: 3 },
            alternateRowStyles: { fillColor: C.light },
            columnStyles: {
                0: { cellWidth: 120 },
                1: { cellWidth: 60, halign: 'right', fontStyle: 'bold', textColor: C.primaryDk },
            },
            margin: { left: 12, right: 12 },
        });

        y = doc.lastAutoTable.finalY + 10;
    }
}

// ── Impact page ────────────────────────────────────────────────────────────────
function addImpactPage(doc, proposal) {
    const impact = proposal.impactPositioningSummary;
    if (!impact) return;

    doc.addPage();
    let y = 20;
    y = sectionTitle(doc, 'ENVIRONMENTAL IMPACT', y);

    // Metric cards
    const metrics = [
        { label: 'Plastic Saved', value: impact.plasticSavedKg, unit: 'kg', color: C.blue },
        { label: 'Carbon Offset', value: impact.carbonOffsetKg, unit: 'kg CO2', color: C.muted },
        { label: 'Trees Equivalent', value: impact.treesEquivalent, unit: 'trees', color: C.green },
        { label: 'Water Saved', value: impact.waterSavedLiters, unit: 'liters', color: C.cyan },
    ].filter((m) => m.value);

    const colW = 180 / 2;
    metrics.forEach((m, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = 14 + col * (colW + 2);
        const cardY = y + row * 36;

        doc.setFillColor(...C.light);
        doc.roundedRect(x, cardY, colW, 30, 3, 3, 'F');
        doc.setDrawColor(...m.color);
        doc.setLineWidth(1.5);
        doc.roundedRect(x, cardY, colW, 30, 3, 3, 'D');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        px(doc, m.color);
        doc.text(m.value.toLocaleString(), x + 10, cardY + 14);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        px(doc, C.muted);
        doc.text(m.unit, x + 10, cardY + 21);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        px(doc, C.dark);
        doc.text(m.label, x + colW - 6, cardY + 10, { align: 'right' });
    });

    y += Math.ceil(metrics.length / 2) * 36 + 10;

    // Environmental banner
    if (impact.keyMessage) {
        y = checkY(doc, y, 30);
        doc.setFillColor(...C.primaryDk);
        doc.roundedRect(12, y, 184, 28, 3, 3, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        px(doc, C.white);
        doc.text('ENVIRONMENTAL IMPACT STATEMENT', 14, y + 9);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        px(doc, [209, 255, 235]);
        const splitMsg = doc.splitTextToSize(impact.keyMessage, 176);
        doc.text(splitMsg, 14, y + 18);
        y += splitMsg.length * 5 + 25;
    }

    // What this means
    y = checkY(doc, y, 30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    px(doc, C.mid);
    doc.text('What This Means', 14, y);
    y += 7;

    const bulletPoints = [
        impact.plasticSavedKg > 0 && `Eliminates ${impact.plasticSavedKg.toLocaleString()} kg of plastic waste from landfills and oceans.`,
        impact.carbonOffsetKg > 0 && `Offsets ${impact.carbonOffsetKg.toLocaleString()} kg of CO₂ emissions — equivalent to driving ${Math.round(impact.carbonOffsetKg * 4).toLocaleString()} km less.`,
        impact.treesEquivalent > 0 && `Equivalent to planting ${impact.treesEquivalent.toLocaleString()} fully grown trees.`,
        impact.waterSavedLiters > 0 && `Saves ${impact.waterSavedLiters.toLocaleString()} liters of water — enough for ${Math.round(impact.waterSavedLiters / 2).toLocaleString()} people for a day.`,
    ].filter(Boolean);

    bulletPoints.forEach((point) => {
        y = checkY(doc, y, 10);
        doc.setFillColor(...C.primary);
        doc.circle(16, y - 2, 1.5, 'F');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        px(doc, C.dark);
        const splitPoint = doc.splitTextToSize(point, 170);
        doc.text(splitPoint, 20, y);
        y += splitPoint.length * 5 + 4;
    });
}

// ── Page numbers footer ────────────────────────────────────────────────────────
function addPageFooters(doc, totalPages) {
    for (let i = 2; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFillColor(...C.light);
        doc.rect(0, 278, 210, 19, 'F');
        doc.setDrawColor(...C.border);
        doc.setLineWidth(0.3);
        doc.line(0, 278, 210, 278);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        px(doc, C.muted);
        doc.text('Confidential — Rayeva Sustainable Commerce Platform', 14, 288);
        doc.text(`Page ${i} of ${totalPages}`, 196, 288, { align: 'right' });
    }
}

// ── Main export function ───────────────────────────────────────────────────────
export const exportProposalToPDF = (proposal, formatCurrency) => {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });

    // Page 1: Cover
    addCoverPage(doc, proposal, formatCurrency);

    // Page 2: Products
    addProductsPage(doc, proposal, formatCurrency);

    // Page 3: Budget
    addBudgetPage(doc, proposal, formatCurrency);

    // Page 4: Impact
    addImpactPage(doc, proposal);

    // Add footers to all pages except cover
    addPageFooters(doc, doc.getNumberOfPages());

    // Save
    const filename = `Rayeva_Proposal_${proposal.clientName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(filename);
};
