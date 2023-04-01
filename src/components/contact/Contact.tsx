import { Button, TextField, Typography } from '@mui/material'
import React, { useRef } from 'react'

import { useSupabaseContext } from '../../contexts/SupabaseContext'
import { useUtilsContext } from '../../contexts/UtilsContext'
import styles from './Contact.module.scss'

const Contact = () => {
  const { client, user } = useSupabaseContext()
  const { sendAlert } = useUtilsContext()
  const messageRef = useRef<HTMLInputElement>()
  const emailRef = useRef<HTMLInputElement>()

  const submit = async () => {
    if (!user?.id && !!localStorage.getItem('sentMessage')) {
      if (
        new Date().valueOf() < JSON.parse(localStorage.getItem('sentMessage'))
      ) {
        sendAlert(
          'Sorry! Please wait 60 seconds before sending another message',
          'error'
        )
        return
      }
    }
    const message = messageRef.current.value
    const email = emailRef.current.value

    if (message.length === 0) {
      sendAlert('Please enter a message', 'error')
      return
    }

    const { error } = await client.from('contact_submissions').insert({
      user_uuid: user?.id ?? null,
      contact_email: email,
      submission: message,
    })

    if (error) {
      sendAlert(`Unable to submit message - ${error.message}`, 'error')
    } else {
      sendAlert(`Thanks for leaving a message! We will look into it soon :)`)
      if (!user?.id) {
        localStorage.setItem(
          'sentMessage',
          JSON.stringify(new Date().valueOf() + 60000)
        )
      }
      messageRef.current.value = ''
      emailRef.current.value = ''
    }
  }

  return (
    <div className={`${styles.container} fadeIn`}>
      <Typography variant="h4">Contact Us</Typography>
      <Typography variant="subtitle1">
        Leave any questions, feedback, or backfill requests down below!
      </Typography>
      <Typography variant="subtitle2">
        For backfill requests, you <strong>must</strong> be logged in, and
        provide details about the league name, race and driver picks for each
        player e.g.
      </Typography>
      <div>
        <Typography variant="subtitle2" fontStyle="italic">
          League name
        </Typography>
        <Typography variant="subtitle2" fontStyle="italic">
          Bahrain, player@email.com, driver pick, dnf pick
        </Typography>
        <Typography variant="subtitle2" fontStyle="italic">
          Saudi Arabian, player2@email.com, driver pick, dnf pick
        </Typography>
      </div>
      <TextField
        label="Contact email"
        autoComplete="email"
        fullWidth
        inputRef={emailRef}
      />
      <TextField
        fullWidth
        required
        label="Message"
        autoComplete="off"
        multiline
        minRows={3}
        inputRef={messageRef}
      />
      <Button variant="contained" onClick={submit}>
        Submit
      </Button>
    </div>
  )
}

export default Contact
