import { FC } from "react"

export const Error: FC = ({ children }) => {
  return (
    <div className="panel-block">
      <div className="column">
        <article className="notification is-danger">{children}</article>
      </div>
    </div>
  )
}
