import styles from "./select.module.css";
import { useState, useEffect, useRef } from 'react'

// declaring the custom types
export type SelectOption = {
  label: string,
  value: string | number,
}

type MultipleSelectProps = {
  multiple: true
//the ? makes this an optional field not compulsory
  // currently selected option
  value: SelectOption[],
  //ability to change the option so this can be called and app will handle this
  onChange: (value: SelectOption[]) => void,
  //list of options
}

type SingleSelectProps = {
  multiple?: false
//the ? makes this an optional field not compulsory
  // currently selected option
  value?: SelectOption,
  //ability to change the option so this can be called and app will handle this
  onChange: (value: SelectOption | undefined) => void,
  //list of options
}

type SelectProps = {

  options: SelectOption[]
} & ( SingleSelectProps | MultipleSelectProps)

export function Select({ multiple, value, onChange, options}: SelectProps) {
  // declaring the state variables
   const [isOpen, setIsOpen] = useState(false)
   const [highlightedIndex, sethighlightedIndex] = useState(0)
   const containerRef = useRef<HTMLDivElement>(null)

  function clearOptions() {
    multiple ? onChange([]) : onChange(undefined)
  }

  function selectOption(option:SelectOption) {
    //only calls onchange if its different option from current one
    if (multiple) {
      // if value is includes option filter this out (same option).
      if (value.includes(option)) {
         onChange(value.filter(o=> o !== option)) }
      else{
        // if not already selected spread the value array add selected option to it.
        onChange([...value, option])
      }

    } else {
      if(option !== value) onChange(option)
    }
  }

  function isOptionSelected(option:SelectOption) {
    // if the opiton is the same as the value of the box it is the currently selected one for singlular select
    // for mutiple of value array includes option then its selected
    return multiple ? value.includes(option):option === value
  }

  // simple use effect so that when open property changes to open the highlighted index goes to zero
  useEffect(() => {
    if(isOpen) sethighlightedIndex(0)
  }, [isOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // exit if the click key on another element that is not select element
      if (e.target != containerRef.current) return
      // e.code gives key being pressed and handles different keys what to do.
      switch (e.code) {
        case "Enter":
        case "Space":
          //toggle between open closed for the list with space or enter.
          setIsOpen(prev => !prev)
          //select the option currently highlighted by the user
          if (isOpen) selectOption(options[highlightedIndex])
          break;
         // using curly braces to ensure the newValue doesn't accidentlly leak out of this scopewise
        case "ArrowUp":
        case "ArrowDown": {
          // open dropdown if arrowkey pressed and not open currently
          if (!isOpen) {
            setIsOpen(true)
            break
          }
          // if dropdown is open then add one to highlighted index if down arrow if not add 1
          const newValue = highlightedIndex + (e.code === "ArrowDown" ? 1 : -1)
          if (newValue >= 0 && newValue <= options.length) {
            sethighlightedIndex(newValue)
          }
          break
        }

        // default:
        //   break;

        case "Escape":
          setIsOpen(false)
          break

    }}
    containerRef.current?.addEventListener("keydown",handler)
    return ()=> {
    containerRef.current?.removeEventListener("keydown",handler)
  }
  }, [isOpen, highlightedIndex, options])


  return (
    <div
      // onclick changes state to opposite of what currently is
      // onblur ensure doesn't when someone clicks off element
      ref={containerRef}
      onBlur={()=> setIsOpen(false)}
      onClick={()=> setIsOpen(prev=>!prev) }
      tabIndex={0}
      className={styles.container}>
      <span className={styles.value}>{multiple ? value.map(v => (<button
      onClick={ e => {
        //stops the onclick event going to the parent div
        e.stopPropagation()
        selectOption(v)
      }}
      className={styles["option-badge"]}
      >
        {v.label}
        <span className={styles["remove-btn"]} >&times;</span>
      </button>) ) : value?.label}</span>
      <button
        onClick={ e => {
          //stops the onclick event going to the parent div
          e.stopPropagation()
          clearOptions()
        }
        }
        className={styles["clear-btn"]}>
        &times;
      </button>
      <div className={styles.divider}></div>
      <div className={styles.caret}></div>
      {/* if isOpen set to true add styles.show class otherwise won't show*/}
      <ul className={`${styles.options} ${isOpen? styles.show : ""}`}>
        {options.map((option, index )=>(
          <li
          onClick={e=>{
            //stop this event actions occuring anywhere apart from this element
            e.stopPropagation()
            selectOption(option)
            // autoclose the options dropdown after selecting one
            setIsOpen(false)
          }}
          onMouseEnter={e=>{
            e.stopPropagation()
            sethighlightedIndex(index)
          }}
          key={option.value}
          className={`${styles.option} ${
            isOptionSelected(option) ? styles.selected : ""
          }
          ${
            index === highlightedIndex ? styles.highlighted : ""
          }`}>
          {option.label}
          </li>
        ))}
      </ul>
    </div>
  )
}
