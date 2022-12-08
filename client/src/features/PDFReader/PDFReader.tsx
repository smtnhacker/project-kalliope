import React, { useEffect, useState, useRef, useCallback } from "react"
import { pdfjs } from "react-pdf"
import { Document, Page } from "react-pdf/dist/esm/entry.webpack5"
import { useInView } from "react-intersection-observer";
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

interface PageWrapperProps {
  inputRef: (el : HTMLDivElement | null) => void,
  scale: number,
  pageNumber: number,
  onVisible: (pageNum: number) => void
}

function PageWrapper(props: PageWrapperProps) {
  const { ref: inViewRef, inView, entry } = useInView({
    threshold: 0.5
  })

  const getRef = useCallback(
    (node: HTMLDivElement) => {
      // assign to provided ref
      props.inputRef(node)
      // assign to intersection observer ref
      inViewRef(node)
    },
    [inViewRef, props]
  )

  // check visibility
  useEffect(() => {
    if (inView) {
      props.onVisible(props.pageNumber)
    }
  }, [inView, props])

  return (
    <Page
      inputRef={getRef}
      pageNumber={props.pageNumber}
      scale={props.scale || 1.0} />
  )
}

function PDFReader() {
  const [numPages, setNumPages] = useState<number>(1)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [scale, setScale] = useState<number>(1.0)

  // inefficient navigation
  const pageRefs = useRef<any[]|null[]>([])

  const handleLoadSuccess = ({ numPages } : { numPages: number }) => {
    setNumPages(numPages)

    // setup refs for each pages
    pageRefs.current = pageRefs.current.slice(0, numPages)
  }
  
  const changePage = (newPage: number) => {
    // ensure that the page is valid
    if (newPage <= 0 || newPage > numPages) {
      return
    }
    setPageNumber(newPage)

    // ignore if currently still typing
    if (isNaN(newPage)) {
      return
    }

    // for navigation
    pageRefs.current[newPage-1].scrollIntoView()
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
      <div className={styles.main}>
        <Document 
          className={styles.document}
          file={SAMPLE_URL}
          onLoadSuccess={handleLoadSuccess} 
          options={options}>
          {
            Array.from(
              new Array(numPages),
              (el, index) => (
                <PageWrapper
                  inputRef={el => pageRefs.current[index] = el}
                  key={`page_${index+1}`}
                  pageNumber={index+1}
                  scale={scale || 1.0}
                  onVisible={p => setPageNumber(p)} />
              )
            )
          }
          {/* <Page 
            pageNumber={pageNumber}
            scale={scale || 1.0} />
          { (pageNumber < numPages) && 
          <Page
            pageNumber={pageNumber+1}
            scale={scale || 1.0} />
          } */}
        </Document>
      </div>
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
              onChange={e => changeScale(parseInt(e.target.value) / 100)} />
            <button onClick={() => changeScale(scale + 0.1)}>+</button>
          </div>
        </div>
        <div className={styles.right}>
          {/* TO-DO */}
        </div>
      </nav>
    </div>
  )
}

export default PDFReader;
