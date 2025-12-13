import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

/**
 * 보고서 PDF 생성
 */
export const generateReportPDF = async (reportData, quarter) => {
  const doc = new jsPDF('p', 'mm', 'a4')
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  let yPosition = 20

  // 헤더
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Global BUSAN', pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 10

  doc.setFontSize(16)
  doc.setFont('helvetica', 'normal')
  doc.text(reportData.title || `${quarter} Progress Report`, pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 10

  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Period: ${reportData.period || quarter}`, pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 15

  // 재무 개요
  doc.setFontSize(14)
  doc.setTextColor(0, 0, 0)
  doc.setFont('helvetica', 'bold')
  doc.text('Financial Overview', 20, yPosition)
  yPosition += 10

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Funds Received: $${reportData.fundsReceived?.toLocaleString() || 0}`, 20, yPosition)
  yPosition += 7
  doc.text(`Funds Spent: $${reportData.fundsSpent?.toLocaleString() || 0}`, 20, yPosition)
  yPosition += 7
  doc.text(`Net Balance: $${((reportData.fundsReceived || 0) - (reportData.fundsSpent || 0)).toLocaleString()}`, 20, yPosition)
  yPosition += 15

  // 마일스톤
  if (reportData.milestones && reportData.milestones.length > 0) {
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Project Milestones', 20, yPosition)
    yPosition += 10

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    reportData.milestones.forEach((milestone, index) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage()
        yPosition = 20
      }
      const status = milestone.status === 'completed' ? '✓' : '○'
      doc.text(`${status} ${milestone.title} (${milestone.progress}%)`, 25, yPosition)
      yPosition += 7
    })
    yPosition += 10
  }

  // 영향 지표
  if (reportData.impactMetrics) {
    if (yPosition > pageHeight - 40) {
      doc.addPage()
      yPosition = 20
    }
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Impact Metrics', 20, yPosition)
    yPosition += 10

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    if (reportData.impactMetrics.internationalPartnerships) {
      doc.text(`International Partnerships: ${reportData.impactMetrics.internationalPartnerships}`, 20, yPosition)
      yPosition += 7
    }
    if (reportData.impactMetrics.teamMembers) {
      doc.text(`Team Members: ${reportData.impactMetrics.teamMembers}`, 20, yPosition)
      yPosition += 7
    }
    if (reportData.impactMetrics.communityMembers) {
      doc.text(`Community Members: ${reportData.impactMetrics.communityMembers}`, 20, yPosition)
      yPosition += 7
    }
    if (reportData.impactMetrics.socialMediaReach) {
      doc.text(`Social Media Reach: ${reportData.impactMetrics.socialMediaReach.toLocaleString()}`, 20, yPosition)
      yPosition += 7
    }
    yPosition += 10
  }

  // 재무 세부 내역
  if (reportData.financialBreakdown) {
    if (yPosition > pageHeight - 40) {
      doc.addPage()
      yPosition = 20
    }
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Financial Breakdown', 20, yPosition)
    yPosition += 10

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    Object.entries(reportData.financialBreakdown).forEach(([category, amount]) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage()
        yPosition = 20
      }
      const categoryName = category.charAt(0).toUpperCase() + category.slice(1)
      doc.text(`${categoryName}: $${amount.toLocaleString()}`, 25, yPosition)
      yPosition += 7
    })
    yPosition += 10
  }

  // 다음 분기 목표
  if (reportData.nextQuarterGoals && reportData.nextQuarterGoals.length > 0) {
    if (yPosition > pageHeight - 40) {
      doc.addPage()
      yPosition = 20
    }
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Next Quarter Goals', 20, yPosition)
    yPosition += 10

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    reportData.nextQuarterGoals.forEach((goal) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage()
        yPosition = 20
      }
      doc.text(`• ${goal}`, 25, yPosition)
      yPosition += 7
    })
  }

  // 푸터
  const totalPages = doc.internal.pages.length - 1
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(
      `Page ${i} of ${totalPages} | Generated on ${new Date().toLocaleDateString()}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    )
  }

  return doc
}

/**
 * 지분구조 PDF 생성
 */
export const generateEquityStructurePDF = async (equityData) => {
  const doc = new jsPDF('p', 'mm', 'a4')
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  let yPosition = 20

  // 헤더
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Global BUSAN', pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 10

  doc.setFontSize(16)
  doc.setFont('helvetica', 'normal')
  doc.text('Equity Structure Report', pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 15

  // 총 기부금
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Total Donations', 20, yPosition)
  yPosition += 10

  doc.setFontSize(18)
  doc.setTextColor(0, 100, 0)
  doc.text(`$${equityData.totalAmount?.toLocaleString() || 0}`, 20, yPosition)
  yPosition += 15

  // 통계
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 0, 0)
  doc.text('Statistics', 20, yPosition)
  yPosition += 10

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Total Donors: ${equityData.donorCount || 0}`, 20, yPosition)
  yPosition += 7
  doc.text(`Average Donation: $${equityData.averageDonation?.toLocaleString() || 0}`, 20, yPosition)
  yPosition += 15

  // 상위 기부자
  if (equityData.topDonors && equityData.topDonors.length > 0) {
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Top Donors', 20, yPosition)
    yPosition += 10

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    equityData.topDonors.slice(0, 10).forEach((donor, index) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage()
        yPosition = 20
      }
      doc.text(`${index + 1}. ${donor.name}: $${donor.amount.toLocaleString()}`, 25, yPosition)
      yPosition += 7
    })
    yPosition += 10
  }

  // 최근 기부 내역
  if (equityData.recentDonations && equityData.recentDonations.length > 0) {
    if (yPosition > pageHeight - 40) {
      doc.addPage()
      yPosition = 20
    }
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Recent Donations', 20, yPosition)
    yPosition += 10

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    equityData.recentDonations.slice(0, 15).forEach((donation) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage()
        yPosition = 20
      }
      doc.text(`${donation.date}: ${donation.name} - $${donation.amount.toLocaleString()}`, 25, yPosition)
      if (donation.blockchain) {
        doc.setFontSize(8)
        doc.setTextColor(100, 100, 100)
        doc.text(`Blockchain: ${donation.blockchain}`, 25, yPosition + 4)
        doc.setFontSize(10)
        doc.setTextColor(0, 0, 0)
        yPosition += 10
      } else {
        yPosition += 7
      }
    })
  }

  // 푸터
  const totalPages = doc.internal.pages.length - 1
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(
      `Page ${i} of ${totalPages} | Generated on ${new Date().toLocaleDateString()}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    )
  }

  return doc
}

/**
 * HTML 요소를 이미지로 변환하여 PDF에 추가
 */
export const addHTMLToPDF = async (doc, elementId, options = {}) => {
  try {
    const element = document.getElementById(elementId)
    if (!element) {
      console.warn(`Element with id "${elementId}" not found`)
      return doc
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      ...options
    })

    const imgData = canvas.toDataURL('image/png')
    const imgWidth = doc.internal.pageSize.getWidth() - 40
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    // 페이지가 넘어갈 경우 새 페이지 추가
    const pageHeight = doc.internal.pageSize.getHeight()
    const currentY = doc.internal.getCurrentPageInfo().pageNumber * pageHeight
    if (currentY + imgHeight > pageHeight) {
      doc.addPage()
    }

    doc.addImage(imgData, 'PNG', 20, doc.internal.getCurrentPageInfo().pageNumber * pageHeight - pageHeight + 20, imgWidth, imgHeight)

    return doc
  } catch (error) {
    console.error('Error adding HTML to PDF:', error)
    return doc
  }
}

