import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material'
import React from 'react'

import { DriversDbProps } from '../../../interfaces'
import styles from './Picker.module.scss'

interface PickerProps {
  id: string
  drivers: Map<number, DriversDbProps>
  submitHandler: any
  preSelectedDriver: number | null
  rowId: number
  disabled?: boolean
}

const Picker: React.FC<PickerProps> = ({
  id,
  drivers,
  submitHandler,
  preSelectedDriver,
  rowId,
  disabled = false,
}) => {
  const [driver, setDriver] = React.useState<number>(preSelectedDriver ?? -1)

  const handleChange = (e: SelectChangeEvent) => {
    setDriver(Number(e.target.value))
  }

  const handleSubmit = () => {
    if (driver === -1) return
    submitHandler(driver, rowId)
  }

  return (
    <div className={styles.container}>
      <FormControl
        key={id}
        sx={{
          m: 1,
          width: 200,
        }}
      >
        <InputLabel id={`picker-label-${id}`}>Driver</InputLabel>
        <Select
          labelId={`picker-label-${id}`}
          value={driver.toString()}
          label="Driver"
          onChange={handleChange}
          disabled={disabled}
          sx={{
            '& .MuiSelect-select': {
              display: 'flex',
              columnGap: '0.5rem',
              alignItems: 'center',
            },
          }}
        >
          <MenuItem value={-1} disabled>
            Pick a driver
          </MenuItem>
          {Array.from(drivers.values()).map((key) => {
            return (
              <MenuItem value={key.id} key={key.id} className={styles.picker}>
                <span>
                  {key.given_name} {key.last_name}
                </span>
                <img src={`images/${key.constructor}.png`} height={20} />
              </MenuItem>
            )
          })}
        </Select>
      </FormControl>
      <Button
        onClick={handleSubmit}
        disabled={driver === -1 || disabled}
        variant="outlined"
      >
        Submit
      </Button>
    </div>
  )
}

export default Picker
