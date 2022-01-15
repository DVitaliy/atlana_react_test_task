import { Router, Link } from "@reach/router"
import Details from "./pages/details"
import Listing from "./pages/listing"

export default function App() {
  return (
    <article className="panel">
      <p className="panel-heading">
        <Link to="/">GitHub searcher</Link>
      </p>
      <Router>
        <Listing path="/" />
        <Details path="/u/:login" />
      </Router>
      <div className="panel-block is-pulled-right">
        <Link to="/u/dvitaliy" className="has-text-grey-lighter is-pulled-right">
          @DVitaliy
        </Link>
      </div>
    </article>
  )
}
