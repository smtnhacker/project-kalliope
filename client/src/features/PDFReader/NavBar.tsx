import { useEffect, useState } from "react";
import { IconContext } from "react-icons/lib/esm/iconContext";
import {
  MdMenu, MdBookmarkBorder, MdBookmark
} from "react-icons/md"

interface NavBarProps {
    styles: any,
    metadata: any | null,
    numPages: number,
    setPageNumberRef: any,
    scale: number,
    bookmark: number,
    onChangePage: (e: number) => void,
    onChangeScale: (e: number) => void,
    onChangeBookmark: (e: number) => void
}

function NavBar({ styles, metadata, numPages, scale, bookmark, ...props }: NavBarProps) {
  const [pageNumber, setPageNumber] = useState(1)

  // Provide access to method to parent
  useEffect(() => {
    props.setPageNumberRef.current = setPageNumber
  }, [props.setPageNumberRef])

  return (
    <nav className={styles.nav}>
      <div className={styles.left}>
        <button>
          <IconContext.Provider
            value={{ size: "2rem", color: "var(--text-color)" }}
          >
            <MdMenu />
          </IconContext.Provider>
        </button>
        {metadata ? (metadata as any).info.Title : "No Title"}
      </div>
      <div className={styles.mid}>
        <div className={styles.page}>
          <input
            type="number"
            name="curpage"
            min="1"
            max={numPages.toString()}
            value={pageNumber.toString()}
            onChange={(e) => props.onChangePage(parseInt(e.target.value))}
          />
          / <>{numPages}</>
        </div>
        <div className={styles.zoom}>
          <button onClick={() => props.onChangeScale(scale - 0.1)}>-</button>
          <input
            type="number"
            name="zoom"
            min="1"
            max="500"
            value={Math.round(100 * scale)}
            onChange={(e) => props.onChangeScale(parseInt(e.target.value) / 100)}
          />
          <button onClick={() => props.onChangeScale(scale + 0.1)}>+</button>
        </div>
      </div>
      <div className={styles.right}>
        <IconContext.Provider value={{ size: "2rem" }}>
          {bookmark === pageNumber ? (
            <button onClick={(e) => props.onChangeBookmark(0)}>
              <MdBookmark />
            </button>
          ) : (
            <button onClick={(e) => props.onChangeBookmark(pageNumber)}>
              <MdBookmarkBorder />
            </button>
          )}
        </IconContext.Provider>
      </div>
    </nav>
  );
}

export default NavBar;
