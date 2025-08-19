// data/questions.ts
export type AnswerValue = 'yes'|'no'|'unknown';
export type Q = { key: string; label: string };

export const QUESTIONS: Q[] = [
  { key:'password_policy', label:'Do you enforce strong passwords (≥12 chars with complexity) for staff accounts?' },
  { key:'2fa',             label:'Is 2-factor authentication enabled on critical accounts (email/cloud/accounting)?' },
  { key:'backup',          label:'Do you perform regular (weekly or more) redundant backups and test restores?' },
  { key:'patching',        label:'Are OS/browsers/office apps kept up to date with automatic updates?' },
  { key:'endpoint_av',     label:'Is antivirus/EDR installed on all company PCs with periodic scans?' },
  { key:'vpn',             label:'Is remote access only allowed via company VPN (no public Wi-Fi)?' },
  { key:'access_review',   label:'Do you remove access on exit/role change and review access quarterly?' },
  { key:'email_security',  label:'Do you run phishing awareness training/campaigns at least quarterly?' },
  { key:'logging',         label:'Are logins/admin changes logged with alerts on critical systems?' },
  { key:'vendor',          label:'Are partner/cloud security responsibilities documented with least privilege?' },
  { key:'asset',           label:'Do you maintain an up-to-date asset inventory (devices/software)?' },
  { key:'incident',        label:'Do you have documented incident response steps and contacts?' }
];
