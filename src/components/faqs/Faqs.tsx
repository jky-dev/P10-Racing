import { ExpandMore } from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import React, { useMemo } from 'react'
import { InView } from 'react-intersection-observer'

import { useUtilsContext } from '../../contexts/UtilsContext'

interface FaqProps {
  heading: string
  faqs: { q: string; a: string; custom?: JSX.Element }[]
}

const Faqs = () => {
  const { pointsMap } = useUtilsContext()

  const faqs: FaqProps[] = useMemo(
    () => [
      {
        heading: 'Joining',
        faqs: [
          {
            q: 'How do I sign up?',
            a: 'You can sign up by navigating to the "Login" tab in the top right of the navigation bar on desktop, or via the hamburger menu on mobile.',
          },
          {
            q: 'When I go to sign up with Google, why does it try to sign me into <gibberish>.supabase.co?',
            a: 'P10 Racing uses Supabase to handle our authentication and database needs. You can find more information at https://supabase.com.',
          },
          {
            q: 'What information do you collect from me when I sign up with Google?',
            a: 'We only get the email you used to sign up with as a unique identifier for your user account. You can later customise your username by navigating to the "Profile" tab.',
          },
        ],
      },
      {
        heading: 'Leagues',
        faqs: [
          {
            q: 'How do I create a league?',
            a: 'You can join a league by visiting the "Leagues" tab once you have logged in to your account. From there, you are able to create a new fantasy league by providing a name for the new league and clicking the "Create a League" button.',
          },
          {
            q: 'How do I join a league?',
            a: 'You can join a league by receiving an invite link from a league creator, or inputting the invite code from the link in the relevant field on the "Leagues" tab.',
          },
          {
            q: 'How do I invite my friends to a league?',
            a: 'There is a share icon in the top right of the "Leagues" tab that copies an invite link to your clipboard, ready for sharing.',
          },
        ],
      },
      {
        heading: 'Picks',
        faqs: [
          {
            q: 'How many points do I get if my driver finishes X?',
            a: 'test',
            custom: (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Position</TableCell>
                    <TableCell align="right">Points Gained</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.from(pointsMap.entries())
                    .sort((a, b) => a[0] - b[0])
                    .map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell>{key}</TableCell>
                        <TableCell align="right">{value}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            ),
          },
          {
            q: 'How many points do I earn for my DNF pick?',
            a: 'If your DNF pick is the first DNF of the race (or P20, in the case of simultaneous DNFs), you will earn 10 points. If you choose "No DNF" and there happens to be no DNFs in the race, you will earn an additional 25 points! Although choose wisely, there have only been a handful of races in F1 history with no DNFs.',
          },
          {
            q: 'How long do I have to lock in a pick for the race?',
            a: 'You will be able to pick drivers up until qualifying starts. After qualifying, you lose the opportunity to lock in a driver and if you did not pick, will not earn any points for that race.',
          },
        ],
      },
      {
        heading: 'Misc.',
        faqs: [
          {
            q: 'Where do I give feedback/suggestions?',
            a: 'There will be a form at the bottom of the page where you can submit feedback (coming soon), otherwise you can email p10racingleague AT gmail DOT com',
          },
        ],
      },
    ],
    [pointsMap]
  )

  const onChange = (inView: boolean, entry: IntersectionObserverEntry) => {
    if (inView) {
      entry.target.classList.add('fadeInTop')
    }
  }

  return (
    <>
      <Typography variant="h4">FAQs</Typography>
      {faqs.map((faq) => (
        <InView onChange={onChange} key={faq.heading}>
          <Typography variant="h5" sx={{ mb: 2, mt: 2 }}>
            {faq.heading}
          </Typography>
          {faq.faqs.map((qa) => (
            <Accordion key={qa.q}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography>{qa.q}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {qa.custom ? qa.custom : <Typography>{qa.a}</Typography>}
              </AccordionDetails>
            </Accordion>
          ))}
        </InView>
      ))}
    </>
  )
}

export default Faqs
