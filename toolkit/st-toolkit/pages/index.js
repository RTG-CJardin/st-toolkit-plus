import homeStyles from "styles/Home.module.scss";
import Nav from "components/Nav"

export default function Home() {
  return (
    <div>
      <Nav />
      <h1>This is an h1 tag</h1>
      <h2>This is an h2 tag</h2>
      <h3>This is an h3 tag</h3>
      <h4>This is an h4 tag</h4>
      <p>This is a p tag, <strong>this part is strong</strong>, <em>and this part is em.</em></p>
      <nav>
        <button className={homeStyles.item}>
          this is a button
        </button>

        <button className={homeStyles.item}>
          this is another button
        </button>

        <button className={homeStyles.item}>
          yet another button
        </button>
      </nav>
    </div>
  )
}
