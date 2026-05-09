import { renderToBuffer } from '@react-pdf/renderer';
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica' },
  header: { marginBottom: 20, borderBottomWidth: 2, borderBottomColor: '#1e3a8a', paddingBottom: 10 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1e3a8a' },
  section: { margin: 10, padding: 10, flexGrow: 1 },
  text: { fontSize: 12, marginBottom: 10, lineHeight: 1.5 },
  label: { fontWeight: 'bold', fontSize: 14, marginTop: 20, marginBottom: 5 },
  footer: { position: 'absolute', bottom: 40, left: 40, right: 40, borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingTop: 10, textAlign: 'center', fontSize: 10, color: '#64748b' }
});

const ReceiptPDF = ({ clientName, amount, date, stage, refId }: any) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Eden Immigration Services</Text>
        <Text style={{ fontSize: 10, color: '#64748b' }}>Official Payment Receipt</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Transaction Details</Text>
        <Text style={styles.text}>Receipt ID: {refId}</Text>
        <Text style={styles.text}>Date: {date}</Text>
        <Text style={styles.text}>Received From: {clientName}</Text>
        <Text style={styles.text}>Payment Stage: {stage.replace(/_/g, ' ')}</Text>
        
        <View style={{ marginTop: 40, padding: 20, backgroundColor: '#f8fafc', borderRadius: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1e3a8a' }}>
            Amount Paid: PKR {amount.toLocaleString()}
          </Text>
        </View>

        <Text style={{ marginTop: 40, fontSize: 12 }}>
          Thank you for choosing Eden Immigration Services. Your payment has been verified and confirmed by our finance department.
        </Text>
      </View>

      <Text style={styles.footer}>
        This is a computer-generated document and does not require a physical signature.
        Eden Immigration (Pvt) Ltd. | Lahore, Pakistan
      </Text>
    </Page>
  </Document>
);

export async function generateReceiptBuffer(data: any) {
  return await renderToBuffer(<ReceiptPDF {...data} />);
}
