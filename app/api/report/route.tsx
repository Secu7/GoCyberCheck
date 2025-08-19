// app/api/report/route.tsx
import React from 'react';
import { NextResponse } from 'next/server';
import { sbAdmin } from '@/lib/supabase';
import { QUESTIONS } from '@/data/questions';
import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

export const runtime = 'nodejs';

type AnswerValue = 'yes' | 'no' | 'unknown';
type Answer = { key: string; value: AnswerValue };

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'MISSING_ID' }, { status: 400 });

  const { data, error } = await sbAdmin()
    .from('assessments')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });

  const labelByKey = Object.fromEntries(QUESTIONS.map(q => [q.key, q.label]));
  const created = new Date(data.created_at).toLocaleString('en-CA', { timeZone: 'America/Edmonton' });

  const styles = StyleSheet.create({
    page: { padding: 28, fontSize: 11, lineHeight: 1.4 },
    header: { marginBottom: 16 },
    brand: { fontSize: 18, fontWeight: 700, marginBottom: 6, lineHeight: 1.2 },
    sub: { color: '#555', lineHeight: 1.4 },
    sectionTitle: { fontSize: 13, fontWeight: 700, marginTop: 14, marginBottom: 6 },
    card: { borderWidth: 1, borderColor: '#ddd', borderRadius: 6, padding: 10, marginBottom: 8 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    k: { color: '#555' },
    v: { fontWeight: 700 },
    pillWrap: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
    pill: { borderWidth: 1, borderColor: '#ddd', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3, marginRight: 4, marginBottom: 4 },
    answersHeader: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#ddd', paddingBottom: 6, marginBottom: 4 },
    thQ: { width: '70%', fontWeight: 700 },
    thA: { width: '30%', textAlign: 'right', fontWeight: 700 },
    ansRow: { flexDirection: 'row', paddingVertical: 3, borderBottomWidth: 1, borderColor: '#f0f0f0' },
    tdQ: { width: '70%' },
    tdA: { width: '30%', textAlign: 'right' },
    yes: { color: '#0a7f2e', fontWeight: 700 },
    no: { color: '#b00020', fontWeight: 700 },
    unk: { color: '#666', fontWeight: 700 },
    footer: { marginTop: 16, borderTopWidth: 1, borderColor: '#eee', paddingTop: 8, color: '#777' }
  });

  const improvements: string[] = Array.isArray(data.improvements) ? (data.improvements as string[]) : [];
  const answers: Answer[] = Array.isArray(data.answers) ? (data.answers as Answer[]) : [];

  const Doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brand}>GoCyberCheck — Security Report</Text>
          <Text style={styles.sub}>Generated: {created}  •  Report ID: {String(id).slice(0, 8)}…</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.row}><Text style={styles.k}>Email</Text><Text style={styles.v}>{data.email}</Text></View>
          <View style={styles.row}><Text style={styles.k}>Score</Text><Text style={styles.v}>{data.score}</Text></View>
          <View style={styles.row}><Text style={styles.k}>Grade</Text><Text style={styles.v}>{data.grade}</Text></View>
          <View style={{ marginTop: 6 }}><Text>{data.summary}</Text></View>
        </View>

        <Text style={styles.sectionTitle}>Top recommended fixes</Text>
        <View style={styles.pillWrap}>
          {improvements.map((t, i) => (
            <View key={i} style={styles.pill}><Text>{t}</Text></View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Your answers ({answers.length} questions)</Text>
        <View style={styles.answersHeader}>
          <Text style={styles.thQ}>Question</Text>
          <Text style={styles.thA}>Answer</Text>
        </View>
        {answers.map((a, i) => {
          const label = labelByKey[a.key] || a.key;
          const v = a.value;
          const style = v === 'yes' ? styles.yes : v === 'no' ? styles.no : styles.unk;
          const text = v === 'yes' ? 'Yes' : v === 'no' ? 'No' : 'Not sure';
          return (
            <View key={i} style={styles.ansRow}>
              <Text style={styles.tdQ}>{label}</Text>
              <Text style={[styles.tdA, style]}>{text}</Text>
            </View>
          );
        })}

        <View style={styles.footer}>
          <Text>This report is an informational guide only and not legal or compliance advice.</Text>
          <Text>© {new Date().getFullYear()} GoCyberCheck</Text>
        </View>
      </Page>
    </Document>
  );

  // 교체: 타입 명시 캐스팅으로 TS를 안정화
  const raw: unknown = await pdf(Doc).toBuffer();
  // Node 환경에선 Buffer(=Uint8Array 하위)로 옴 → BodyInit 호환으로 캐스팅
  const body = raw as Uint8Array;

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="GoCyberCheck-Report.pdf"',
    },
  });
}
