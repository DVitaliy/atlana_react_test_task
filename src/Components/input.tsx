import React, { FC, useState, useEffect, useRef, useCallback } from "react"
import { navigate, useLocation } from "@reach/router"

interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  path: string
  setvalue: React.Dispatch<React.SetStateAction<string>>
}

const Input: FC<IInputProps> = ({ setvalue, path, ...props }) => {
  const timer = useRef<number | undefined>(undefined)
  const location = useLocation()

  const getSearchValue = useCallback(() => {
    return location ? decodeURIComponent(new URLSearchParams(location.search).get("q") ?? "") : ""
  }, [location])

  const [query, setQuery] = useState<string>(() => getSearchValue())

  const handleChange = (e: React.SyntheticEvent) => {
    const { value } = e.target as HTMLInputElement
    setQuery(value)
  }

  useEffect(() => {
    clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      if (query !== getSearchValue()) navigate(`${path}?q=${encodeURIComponent(query)}`)
      setvalue(query)
    }, 1000)

    return () => clearTimeout(timer.current)
  }, [query, path, setvalue, getSearchValue])

  // need for history back
  useEffect(() => {
    setQuery(getSearchValue())
  }, [getSearchValue])

  return (
    <div className="panel-block">
      <p className="control has-icons-left">
        <input className="input" type="text" value={query ?? ""} onChange={handleChange} {...props} />
        <span className="icon is-left">
          <i className="fas fa-search" aria-hidden="true"></i>
        </span>
      </p>
    </div>
  )
}

export default Input
