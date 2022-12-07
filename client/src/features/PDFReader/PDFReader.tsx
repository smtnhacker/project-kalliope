import { useEffect, useState } from "react"
import { pdfjs } from "react-pdf"
import { Document, Page } from "react-pdf/dist/esm/entry.webpack5"
import { IconContext } from "react-icons/lib/esm/iconContext";
import {
  MdMenu,
} from "react-icons/md"

import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import styles from "./styles.module.css"

const SAMPLE_URL = "./sample.pdf"
const options = {
  cMapUrl:  `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
  cMapPacked: true,
  standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts`,
}

function PDFReader() {
  const [numPages, setNumPages] = useState()
  const [pageNumber, setPageNumber] = useState(1)

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <div className={styles.left}>
          <button>
            <IconContext.Provider value={{ size: "2rem", color: "var(--text-color)" }}>
              <MdMenu />
            </IconContext.Provider>
          </button>
          Sample PDF Title
        </div>
        <div className={styles.mid}>
          <div className={styles.page}>
            <input type="number" name="curpage" min="1" max="50" defaultValue={1} />
            / 50
          </div>
          <div className={styles.zoom}>
            <button>-</button>
            <input type="number" name="zoom" min="1" max="500" defaultValue={100} />
            <button>+</button>
          </div>
        </div>
        <div className={styles.right}>

        </div>
      </nav>
      <div className={styles.main}>
        <Document file={SAMPLE_URL} options={options}>
          <Page pageNumber={1} />
        </Document>
      </div>
    </div>
  )
}

export default PDFReader;
