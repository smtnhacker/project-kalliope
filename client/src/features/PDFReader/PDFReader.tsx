import React, { useEffect, useState, useRef, useCallback, useMemo } from "react"
import { pdfjs } from "react-pdf"
import { Document, Page } from "react-pdf/dist/esm/entry.webpack5"
import { VariableSizeList as List, areEqual } from "react-window"
import { useInView } from "react-intersection-observer";


import { getBookmarkPage, saveBookmarkPage, BookHash, PageNumber } from "./bookmark"
import NavBar from "./NavBar";

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
  inputRef?: (el : HTMLDivElement | null) => void,
  scale: number,
  pageNumber: number,
  onVisible: (pageNum: number) => void
}

function PageWrapper(props: PageWrapperProps) {
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.5
  })

  const getRef = useCallback(
    (node: HTMLDivElement) => {
      // assign to provided ref
      if (props.inputRef) {
        props.inputRef(node)
      }
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

const VirtualPage = React.memo((props: any) => {
  return (
    <div style={props.style}>
      <PageWrapper 
        pageNumber={props.index+1}
        scale={props.scale || 1.0}
        onVisible={props.onVisible}
      />
    </div>
  )
}, areEqual)

function PDFReader() {
  // Shows/Hides the drag overlay
  const [showDrag, setShowDrag] = useState(false)
  
  // File-specific Metadata
  const [pdfFile, setPdfFile] = useState(SAMPLE_URL)
  const [bookHash, setBookHash] = useState<BookHash>("")
  const [metadata, setMetadata] = useState(null)
  const [pdf, setPDF] = useState<any>()

  // File-specific data needed for UI
  const [numPages, setNumPages] = useState<number>(0)
  
  // For interacting with the document
  const [bookmark, setBookmark] = useState<PageNumber>(0)
  const [scale, setScale] = useState<number>(1.0)  
  // let the navbar handle the state to prevent unnecessary rerenders
  // to the virtual window
  const setPageNumber = useRef((p: PageNumber) => {})
  
  // Used by virtual window
  const listRef: any = React.createRef()
  const pageHeights = useMemo(() => {
    if (!pdf) {
      return 700
    }
    
    const res: any = {}
    
    for (let p = 1; p <= (pdf as any).numPages; p++) {
      pdf.getPage(p)
      .then((page: any) => {
        res[p] = page.getViewport(scale).viewBox[3] * scale
      })
    }

    return res
    
  }, [pdf, scale])

  useEffect(() => {
    if (listRef.current) {
      listRef.current.resetAfterIndex(0)
    }
  }, [pdf, scale, pageHeights, listRef])

  const handleLoadSuccess = (pdf: any) => {
    setPDF(pdf)
    setNumPages(pdf.numPages)
    pdf.getMetadata()
      .then((res: any) => setMetadata(res))

    // Generate BookHash
    let bh: BookHash = ""

    bh = JSON.stringify(pdf.fingerprints)
    setBookHash(bh)
    
    // Load Bookmark
    const bookmarkPage = getBookmarkPage(bh)
    if (bookmarkPage) {
      setBookmark(bookmarkPage)
      // manual page change due to race condition
      setTimeout(() => {
        listRef.current.scrollToItem(bookmarkPage-1)
        setPageNumber.current(bookmarkPage)
      }, 50)
    } else {
      setBookmark(0)
    }

  }

  const handleLoadError = (error: Error) => {
    console.error("Error while loading document!: " + error.message)
    setMetadata(null)
    setPdfFile("")
  }
  
  const changePage = (newPage: number) => {
    // ensure that the page is valid
    if (newPage <= 0 || newPage > numPages) {
      return
    }
    setPageNumber.current(newPage)
    
    // ignore if currently still typing
    if (isNaN(newPage)) {
      return
    }
    
    // for navigation
    listRef.current.scrollToItem(newPage-1)
  }

  const changeScale = (newScale: number) => {
    // ensure the scale is reasonable
    if (newScale < 0.25 || newScale > 5) {
      return
    }
    setScale(newScale)
  }

  const getPageHeight = useCallback((p: PageNumber) => {
    if (pageHeights[p+1]) {
      return pageHeights[p+1]
    }
    return 750
  }, [pageHeights])

  const handleDrop = (e: React.DragEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setShowDrag(false)

    const dt = e.dataTransfer
    const files = dt.files

    // validate that a file is dropped
    if (files.length === 0) {
      return
    }

    // revoke previous file
    if (pdfFile !== SAMPLE_URL) {
      URL.revokeObjectURL(pdfFile)
    }

    const fileURL = URL.createObjectURL(files[0])
    setPdfFile(fileURL)

    // set the tab name
    document.title = files[0].name
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.stopPropagation()
    e.preventDefault()

    setShowDrag(true)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.stopPropagation()
    e.preventDefault()
  }
  
  const handleDragEnd = (e: React.DragEvent) => {
    e.stopPropagation()
    e.preventDefault()

    setShowDrag(false)
  }

  const handleOnVisible = useCallback((p: number) => {
    setPageNumber.current(p)
  }, [])

  const handleChangeBookmark = (p: PageNumber) => {
    setBookmark(p)
    saveBookmarkPage(bookHash, p)
  }
  
  return (
    <div 
      className={styles.container}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDrop={handleDrop}>
      <div className={styles.main}>
        <Document 
          className={styles.document}
          file={pdfFile}
          onLoadSuccess={handleLoadSuccess} 
          onLoadError={handleLoadError}
          options={options}>
          <List
            height={600}
            itemCount={numPages}
            itemSize={getPageHeight}
            ref={listRef}
            width={1000}>
              {({index, style}) => (
                <VirtualPage
                  index={index}
                  style={style}
                  onVisible={handleOnVisible}
                  scale={scale}
                />
              )}
          </List>
        </Document>
      </div>
      <NavBar
        styles={styles}
        metadata={metadata}
        numPages={numPages}
        setPageNumberRef={setPageNumber}
        scale={scale}
        bookmark={bookmark}
        onChangePage={changePage}
        onChangeScale={changeScale}
        onChangeBookmark={handleChangeBookmark}
      />
      <div className={`${styles["drag-prompt"]} ${showDrag && styles["drag-prompt-appear"]}`}>
        Drag and Drop a PDF file
      </div>
    </div>
  )
}

export default PDFReader;
