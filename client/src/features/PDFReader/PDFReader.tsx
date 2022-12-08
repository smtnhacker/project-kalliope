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
  const [numPages, setNumPages] = useState<number>(1)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [scale, setScale] = useState<number>(1.0)

  const handleLoadSuccess = ({ numPages } : { numPages: number }) => {
    setNumPages(numPages);
  }

  const changePage = (newPage: number) => {
    // ensure that the page is valid
    if (newPage <= 0 || newPage > numPages) {
      return
    }
    setPageNumber(newPage)
  }

  const changeScale = (newScale: number) => {
    // ensure the scale is reasonable
    if (newScale < 0.25 || newScale > 5) {
      return
    }
    setScale(newScale)
  }

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
            <input 
              type="number" 
              name="curpage" 
              min="1" max={numPages.toString()} 
              value={pageNumber.toString()} 
              onChange={e => changePage(parseInt(e.target.value))} />
            / <>{numPages}</>
          </div>
          <div className={styles.zoom}>
            <button onClick={() => changeScale(scale - 0.1)}>-</button>
            <input 
              type="number" 
              name="zoom" 
              min="1" 
              max="500" 
              value={Math.round(100 * scale)}
              onChange={e => changeScale(parseInt(e.target.value) / 100)}
              defaultValue="100" />
            <button onClick={() => changeScale(scale + 0.1)}>+</button>
          </div>
        </div>
        <div className={styles.right}>

        </div>
      </nav>
      <div className={styles.main}>
        <Document 
          file={SAMPLE_URL}
          onLoadSuccess={handleLoadSuccess} 
          options={options}>
          <Page 
            pageNumber={pageNumber}
            scale={scale || 1.0} />
        </Document>
      </div>
    </div>
  )
}

export default PDFReader;
