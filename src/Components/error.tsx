import { FC } from "react"

export const Error: FC = ({ children }) => {
  return (
    <div className="panel-block">
      <article className="message is-danger">
        <div className="message-header">
          <p>Error</p>
        </div>
        <div className="message-body">{children}</div>
      </article>
    </div>
  )
}
