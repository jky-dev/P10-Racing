import { render, screen } from '@testing-library/react'
import React from 'react'

import { Races } from '../../../mocks/Races'
import ScheduleCard from './ScheduleCard'

jest.mock('react-intersection-observer', () => ({
  useInView: () => ({
    ref: jest.fn(),
    inView: false,
    entry: jest.fn(),
  }),
}))

describe('Schedule Card', () => {
  const race = Races[0]
  const sprintRace = Races[Races.findIndex((r) => r.sprint_date)]

  it('should render correctly for a non-sprint race', () => {
    render(<ScheduleCard race={race} />)

    expect(screen.getByText('Bahrain Grand Prix'))

    expect(screen.getByTestId('schedule-card-fp1')).toHaveTextContent(
      'Free Practice 1'
    )
    expect(screen.getByTestId('schedule-card-fp2')).toHaveTextContent(
      'Free Practice 2'
    )
    expect(screen.getByTestId('schedule-card-fp3')).toHaveTextContent(
      'Free Practice 3'
    )
    expect(screen.getByTestId('schedule-card-q')).toHaveTextContent(
      'Qualifying'
    )
    expect(screen.getByTestId('schedule-card-r')).toHaveTextContent(
      'Race Start'
    )
    expect(screen.queryByTestId('schedule-card-sq')).toBeNull()
    expect(screen.queryByTestId('schedule-card-s')).toBeNull()
  })

  it('should render correctly for a sprint race', () => {
    render(<ScheduleCard race={sprintRace} />)

    expect(screen.getByText('Chinese Grand Prix'))

    expect(screen.getByTestId('schedule-card-fp1')).toHaveTextContent(
      'Free Practice 1'
    )
    expect(screen.getByTestId('schedule-card-sq')).toHaveTextContent(
      'Sprint Qualifying'
    )
    expect(screen.getByTestId('schedule-card-s')).toHaveTextContent('Sprint')
    expect(screen.getByTestId('schedule-card-q')).toHaveTextContent(
      'Qualifying'
    )
    expect(screen.getByTestId('schedule-card-r')).toHaveTextContent(
      'Race Start'
    )
    expect(screen.queryByTestId('schedule-card-fp2')).toBeNull()
    expect(screen.queryByTestId('schedule-card-fp3')).toBeNull()
  })
})
