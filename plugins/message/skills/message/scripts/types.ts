export interface FragmentMeta {
  to: string;
  subject: string;
  cc?: string;
  bcc?: string;
  title?: string;
}

export interface BuildResult {
  outputPath: string;
  meta: FragmentMeta;
  gmailBody: string;
  outlookBody: string;
  rawBody: string;
  html: string;
}

export interface BuildError {
  message: string;
  line?: number;
  source?: string;
}
