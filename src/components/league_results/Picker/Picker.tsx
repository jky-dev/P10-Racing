import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material'
import e from 'express'
import React from 'react'

import { DriversDbProps, LeagueResultsDbProps } from '../../../interfaces'
import styles from './Picker.module.scss'

interface PickerProps {
  id: string
  drivers: Map<number, DriversDbProps>
  submitHandler: (driverId: number, rowId: number) => void
  resultsRow: LeagueResultsDbProps
  rowId: number
  disabled?: boolean
  submitDnfHandler: (driverId: number, rowId: number) => void
}

const Picker: React.FC<PickerProps> = ({
  id,
  drivers,
  submitHandler,
  resultsRow,
  rowId,
  submitDnfHandler,
  disabled = false,
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
    submitHandler(driver, rowId)
  }

  const handleDnfSubmit = () => {
    if (driver === -1) return
    submitDnfHandler(dnfDriver, rowId)
  }

  return (
    <>
      <div className={styles.container}>
        <FormControl
          key={id}
          sx={{
            m: 1,
            width: 200,
          }}
        >
          <InputLabel id={`picker-label-${id}`}>P10 Pick</InputLabel>
          <Select
            labelId={`picker-label-${id}`}
            value={driver.toString()}
            label="P10 Pick"
            onChange={(e) => handleChange(e, 'p10')}
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
      <div className={styles.container}>
        <FormControl
          key={id + 'dnf'}
          sx={{
            m: 1,
            width: 200,
          }}
        >
          <InputLabel id={`picker-label-${id}-dnf`}>DNF Pick</InputLabel>
          <Select
            labelId={`picker-label-${id}-dnf`}
            value={dnfDriver.toString()}
            label="DNF Pick"
            onChange={(e) => handleChange(e, 'dnf')}
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
            <MenuItem value={241} className={styles.picker}>
              NO DNF!
            </MenuItem>
          </Select>
        </FormControl>
        <Button
          onClick={handleDnfSubmit}
          disabled={dnfDriver === -1 || disabled}
          variant="outlined"
        >
          Submit
        </Button>
      </div>
    </>
  )
}

export default Picker
