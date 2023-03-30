import { ExpandMore } from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import React from 'react'
import { InView } from 'react-intersection-observer'

import { useUtilsContext } from '../../contexts/UtilsContext'
import styles from './About.module.scss'

interface FaqProps {
  heading: string
  faqs: { q: string; a: string; custom?: JSX.Element }[]
}

const About = () => {
  const { pointsMap } = useUtilsContext()

  const faqs: FaqProps[] = [
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
  ]

  const onChange = (inView: boolean, entry: IntersectionObserverEntry) => {
    if (inView) {
      entry.target.classList.add('fadeInTop')
    }
  }

  return (
    <div className={`${styles.container} fadeIn`}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        About
      </Typography>
      <Card sx={{ width: '100%', mb: 2 }} elevation={2}>
        <CardContent className={styles.cardContent}>
          <Typography variant="body1">
            Welcome to P10 Racing, the premier fantasy league for Formula 1 fans
            who love the thrill of the race and the strategic challenge of
            picking the perfect drivers.
          </Typography>
          <Typography variant="body1">
            At P10 Racing, we focus on the battle for the 10th position on the
            starting grid, the position that often goes overlooked in the
            excitement of the top spots. But for fantasy players, this position
            can make all the difference. That's why we've made it the heart of
            our game.
          </Typography>
          <Typography variant="body1">
            Our fantasy league is simple: players select the drivers they think
            will finish 10th in qualifying, and earn points based on how well
            their picks perform. But don't be fooled by the simplicity of the
            concept - the game is packed with strategic depth and excitement.
            Every race presents new challenges and opportunities, and players
            must stay on their toes to stay ahead of the competition.
          </Typography>
          <Typography variant="body1">
            At P10 Racing, we pride ourselves on providing an engaging and
            immersive experience for all our players. Our platform is designed
            to be intuitive and user-friendly, and our community is friendly and
            supportive. Whether you're a hardcore F1 fan or just getting
            started, you'll find a warm welcome here.
          </Typography>
          <Typography variant="body1">
            So why not join us today and put your F1 knowledge to the test? With
            P10 Racing, you'll experience the thrill of the race in a whole new
            way.
          </Typography>
        </CardContent>
      </Card>
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
    </div>
  )
}

export default About
