import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material'
import React from 'react'

import { DriversDbProps, LeagueResultsDbProps } from '../../../interfaces'
import styles from './Picker.module.scss'

interface PickerProps {
  id: string
  drivers: Map<number, DriversDbProps>
  submitHandler: (driverId: number, dnfDriverId: number, rowId: number) => void
  resultsRow: LeagueResultsDbProps
  rowId: number
}

const Picker: React.FC<PickerProps> = ({
  id,
  drivers,
  submitHandler,
  resultsRow,
  rowId,
}) => {
  const [driver, setDriver] = React.useState<number>(
    resultsRow?.driver_id ?? -1
  )
  const [dnfDriver, setDnfDriver] = React.useState<number>(
    resultsRow?.dnf_driver_id ?? -1
  )

  const handleChange = (e: SelectChangeEvent, type: 'p10' | 'dnf') => {
    if (type === 'p10') {
      setDriver(Number(e.target.value))
    } else {
      setDnfDriver(Number(e.target.value))
    }
  }

  const handleSubmit = () => {
    if (driver === -1) return
    if (dnfDriver === -1) return
    submitHandler(driver, dnfDriver, rowId)
  }

  return (
    <>
      <div className={styles.container}>
        <FormControl
          key={id}
          sx={{
            width: 200,
          }}
        >
          <InputLabel id={`picker-label-${id}`}>P10 Pick</InputLabel>
          <Select
            labelId={`picker-label-${id}`}
            value={driver.toString()}
            label="P10 Pick"
            onChange={(e) => handleChange(e, 'p10')}
            sx={{
              '& .MuiSelect-select': {
                display: 'flex',
                columnGap: '0.5rem',
                alignItems: 'center',
              },
            }}
          >
            <MenuItem value={-1}>Pick a driver</MenuItem>
            {Array.from(drivers.values()).map((key) => (
              <MenuItem value={key.id} key={key.id} className={styles.picker}>
                <span>
                  {key.given_name} {key.last_name}
                </span>
                <img src={`images/${key.constructor}.png`} height={20} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl
          key={id + 'dnf'}
          sx={{
            width: 200,
          }}
        >
          <InputLabel id={`picker-label-${id}-dnf`}>DNF Pick</InputLabel>
          <Select
            labelId={`picker-label-${id}-dnf`}
            value={dnfDriver.toString()}
            label="DNF Pick"
            onChange={(e) => handleChange(e, 'dnf')}
            sx={{
              '& .MuiSelect-select': {
                display: 'flex',
                columnGap: '0.5rem',
                alignItems: 'center',
              },
            }}
          >
            <MenuItem value={-1}>Pick a driver</MenuItem>
            {Array.from(drivers.values()).map((key) => (
              <MenuItem value={key.id} key={key.id} className={styles.picker}>
                <span>
                  {key.given_name} {key.last_name}
                </span>
                <img src={`images/${key.constructor}.png`} height={20} />
              </MenuItem>
            ))}
            <MenuItem value={266} className={styles.picker}>
              NO DNF!
            </MenuItem>
          </Select>
        </FormControl>
        <Button
          onClick={handleSubmit}
          disabled={driver === -1 || dnfDriver === -1}
          variant="outlined"
        >
          Submit
        </Button>
      </div>
    </>
  )
}

export default Picker
