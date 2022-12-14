import styles from "./Layout.module.css"

interface Props {
  children: any | null;
}

function Layout(props: Props) {
  return (
    <div className={styles.light}>
      <div className={styles.main}>
        {props.children}
      </div>
    </div>
  )
}

export default Layout;