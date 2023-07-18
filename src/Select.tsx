import styles from "./select.module.css";
import { useState, useEffect } from 'react'

// declaring the custom types
type SelectOption = {
  label: string,
  value: string | number,
}

type SelectProps = {
  //the ? makes this an optional field not compulsory
  // currently selected option
  value?: SelectOption,
  //ability to change the option so this can be called and app will handle this
  onChange: (value: SelectOption | undefined) => void,
  //list of options
  options: SelectOption[]
}

export function Select({value, onChange, options}: SelectProps) {
  // declaring the state variables
   const [isOpen, setIsOpen] = useState(false)
   const [HighlightedIndex, setHighlightedIndex] = useState(0)

  function clearOptions() {
    onChange(undefined)
  }

  function selectOption(option:SelectOption) {
    //only calls onchange if its different option from current one
    if(option !== value) onChange(option)
  }

  function isOptionSelected(option:SelectOption) {
    // if the opiton is the same as the value of the box it is the currently selected one
    return option === value
  }

  // simple use effect so that when open property changes to open the highlighted index goes to zero
  useEffect(() => {
    if(isOpen) setHighlightedIndex(0)
  }, [isOpen])


  return (
    <div
      // onclick changes state to opposite of what currently is
      // onblur ensure doesn't when someone clicks off element
      onBlur={()=> setIsOpen(false)}
      onClick={()=> setIsOpen(prev=>!prev) }
      tabIndex={0}
      className={styles.container}>
      <span className={styles.value}>{value?.label}</span>
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
            setHighlightedIndex(index)
          }}
          key={option.value}
          className={`${styles.option} ${
            isOptionSelected(option) ? styles.selected : ""
          }
          ${
            index === HighlightedIndex ? styles.highlighted : ""
          }`}>
          {option.label}
          </li>
        ))}
      </ul>
    </div>
  )
}
