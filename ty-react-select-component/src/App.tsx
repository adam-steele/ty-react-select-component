import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

import { Select, SelectOption } from "./Select"


const options = [
  {label: "first", value: 1},
  {label: "second", value: 2},
  {label: "third", value: 3},
  {label: "fourth", value: 4},
  {label: "fifth", value: 5}
]

function App() {
  // setting the default value of the select to first in the array setting type to be either whatever
  // the typeof option is or if not had a value set yet it's undefined
  const [value1, setValue1] = useState<SelectOption[]>([options[0]])
  const [value2, setValue2] = useState<SelectOption | undefined>(options[0])

  return (<>
     <Select
      options={options}
      value={value2}
      // on change gives back an option and we will set the value to that option it gives
      onChange={o => setValue2(o)}/>
<Select
      multiple
      options={options}
      value={value1}
      // on change gives back an option and we will set the value to that option it gives
      onChange={o => setValue1(o)}/>
  </>
  )
}

export default App
