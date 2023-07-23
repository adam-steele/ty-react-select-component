import styles from "./select.module.css";
import { useState, useEffect } from 'react'

// declaring the custom types
export type SelectOption = {
  label: string,
  value: string | number,
}

type MutipleSelectProps = {
    //need to set muleiple to true is required
    multiple: true,
   // currently selected options is an array as can be multiple
   value: SelectOption[],
   //ability to change the options an array as can be multiple so this can be called and app will handle this
   onChange: (value: SelectOption[]) => void,
}

type SingleSelectProps = {
  //need to set muleiple to false and make it optional
  multiple?: false,
   //the ? makes this an optional field not compulsory
  // currently selected option
  value?: SelectOption,
  //ability to change the option so this can be called and app will handle this
  onChange: (value: SelectOption | undefined) => void,
}

// select props is all the values inside brackets and either the singleselect or muptiple select properties.
type SelectProps = {
  // Select props includes the options property always
  options: SelectOption[]
} & (SingleSelectProps | MutipleSelectProps) // which or these is chosen depends on if multiple propert is true or not

export function Select({multiple, value, onChange, options}: SelectProps) {
  // declaring the state variables
   const [isOpen, setIsOpen] = useState(false)
   const [highlightedIndex, sethighlightedIndex] = useState(0)

  function clearOptions() {
    // take into account mutiple true or false
    multiple ? onChange([]) : onChange(undefined)
  }

  function selectOption(option:SelectOption) {
    //only calls onchange if its different option from current one
    if (multiple) {
      // if option is already in list of selected remove it
      if(value.includes(option)) {
        onChange(value.filter(o=>o !== option))
      }
      else {
        onChange([...value, option])
      }
    } else {
      if(option !== value) onChange(option)
    }

  }

  function isOptionSelected(option:SelectOption) {
    // if the opiton is the same as the value of the box it is the currently selected one
    return multiple? value.includes(option) : option === value
  }

  // simple use effect so that when open property changes to open the highlighted index goes to zero
  useEffect(() => {
    if(isOpen) sethighlightedIndex(0)
  }, [isOpen])


  return (
    <div
      // onclick changes state to opposite of what currently is
      // onblur ensure doesn't when someone clicks off element
      onBlur={()=> setIsOpen(false)}
      onClick={()=> setIsOpen(prev=>!prev) }
      tabIndex={0}
      className={styles.container}>
        {/* if multiple need to go through each value make it a button so when
        clicked removes it from the list */}
      <span className={styles.value}>{multiple? value.map(v => (
        <button key={v.value}
         className={styles["option-badge"]}
         onClick={e => {
          e.stopPropagation()
          //already handles the case of removing this if
          selectOption(v)
        }
      }>{v.label} <span className={styles["remove-btn"]} >&times;</span></button>
      ))  :value?.label}</span>
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
