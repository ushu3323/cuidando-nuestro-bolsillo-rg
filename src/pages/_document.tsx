import {
  DocumentHeadTags,
  documentGetInitialProps,
  type DocumentHeadTagsProps,
} from "@mui/material-nextjs/v13-pagesRouter";
import Document, {
  Head,
  Html,
  Main,
  NextScript,
  type DocumentContext,
} from "next/document";

class MyDocument extends Document<DocumentHeadTagsProps> {
  static async getInitialProps(ctx: DocumentContext) {
    return documentGetInitialProps(ctx);
  }

  render() {
    return (
      <Html lang="es">
        <Head>
          <meta
            name="description"
            content="Colaboramos entre todos para ahorrar en Río Grande!"
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&display=swap"
            rel="stylesheet"
          />
          <link rel="icon" href="/favicon.svg" />
          <DocumentHeadTags {...this.props} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
