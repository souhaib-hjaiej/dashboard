import React, { useState, useEffect } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Box, Button, TextField, Typography, Modal, IconButton, useTheme } from '@mui/material';
import { Delete, Done } from '@mui/icons-material';
import axios from 'axios';
import dayjs from 'dayjs';

function Calendar() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [eventInput, setEventInput] = useState('');
  const [events, setEvents] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  const theme = useTheme();
  const backendURL = 'http://localhost:3000'; // Replace with your actual backend URL

  // Fetch events from the backend on initial load
  useEffect(() => {
    axios.get(`${backendURL}/event/events`)
      .then((response) => {
        const fetchedEvents = response.data;
  
        // Transform the fetched events into the expected object structure
        const formattedEvents = {};
        fetchedEvents.forEach(event => {
          const dateKey = dayjs(event.date).format('YYYY-MM-DD'); // Format date to YYYY-MM-DD
          if (!formattedEvents[dateKey]) {
            formattedEvents[dateKey] = []; // Initialize if not already present
          }
          formattedEvents[dateKey].push(event); // Add the event to the correct date
        });
  
        setEvents(formattedEvents); // Set the transformed events
        localStorage.setItem('events', JSON.stringify(formattedEvents)); // Store in localStorage
      })
      .catch((error) => {
        console.error('Error fetching events:', error);
      });
  }, []);
  

  // Store updated events in local storage whenever they change
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleAddEvent = () => {
    if (selectedDate && eventInput) {
      const dateKey = selectedDate.format('YYYY-MM-DD');
      const newEvent = { description: eventInput, done: false }; // Default status is "Not Done"

      axios.post(`${backendURL}/event/add`, { date: dateKey, ...newEvent })
        .then((response) => {
          const updatedEvents = {
            ...events,
            [dateKey]: [...(events[dateKey] || []), response.data], // Use the response data to get the created event
          };
          setEvents(updatedEvents);
          setEventInput('');
          setModalOpen(false);
        })
        .catch((error) => {
          console.error('Error adding event:', error);
        });
    }
  };

  const toggleEventStatus = (dateKey, index) => {
    const updatedEvents = { ...events };
    const event = updatedEvents[dateKey][index];
  
    if (!event.done) {
      axios.patch(`${backendURL}/event/update`, { id: event._id, done: true })
        .then(() => {
          event.done = true; // Mark as done
          setEvents(updatedEvents);
        })
        .catch((error) => {
          console.error('Error updating event status:', error);
        });
    }
  };

  const handleDeleteEvent = (dateKey, index) => {
    const event = events[dateKey][index];
  
    axios.delete(`${backendURL}/event/delete`, { data: { id: event._id } })
      .then(() => {
        const updatedEvents = { ...events };
        updatedEvents[dateKey].splice(index, 1);
        if (updatedEvents[dateKey].length === 0) {
          delete updatedEvents[dateKey];
        }
        setEvents(updatedEvents);
      })
      .catch((error) => {
        console.error('Error deleting event:', error);
      });
  };

  const isDateWithEvents = (date) => {
    const dateKey = date.format('YYYY-MM-DD');
    return !!events[dateKey];
  };

  const backgroundColor = theme.palette.mode === 'dark' ? '#1e1e1e' : '#fff';
  const textColor = theme.palette.mode === 'dark' ? '#e0e0e0' : '#000';

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: 2, bgcolor: backgroundColor }}>
        <Box
          sx={{
            flex: 1,
            maxWidth: 600,
            bgcolor: backgroundColor,
            borderRadius: '8px',
            padding: 2,
            boxShadow: 2,
            marginRight: 2,
            color: textColor,
          }}
        >
          <DateCalendar
            value={selectedDate}
            onChange={handleDateChange}
            sx={{
              height: '500px',
              width: '100%',
              '.MuiPickersCalendar-header': {
                bgcolor: theme.palette.mode === 'dark' ? '#303f9f' : '#1976d2',
                color: '#fff',
              },
              '.MuiDayPicker-day[data-selected="true"]': {
                backgroundColor: theme.palette.mode === 'dark' ? '#ffab40' : '#1976d2',
                color: '#fff',
              },
              '.MuiDayPicker-day[data-event="true"]': {
                border: `2px solid ${theme.palette.mode === 'dark' ? '#ff5722' : '#1976d2'}`,
                backgroundColor: theme.palette.mode === 'dark' ? '#ffe0b2' : '#bbdefb',
              },
            }}
            renderDay={(date, selectedDates, pickersDayProps) => {
              const dateKey = date.format('YYYY-MM-DD');
              const hasEvents = isDateWithEvents(date);
              return (
                <Box
                  {...pickersDayProps}
                  data-event={hasEvents ? 'true' : undefined}
                >
                  {pickersDayProps.children}
                </Box>
              );
            }}
          />
          <Button
            variant="contained"
            onClick={() => setModalOpen(true)}
            sx={{ marginTop: 2, bgcolor: '#1976d2' }}
          >
            +
          </Button>
        </Box>

        <Box
          sx={{
            flex: 1,
            maxWidth: 600,
            bgcolor: backgroundColor,
            borderRadius: '8px',
            padding: 2,
            boxShadow: 2,
            color: textColor,
          }}
        >
          <Typography variant="h6">Événements:</Typography>
          <Box>
            {selectedDate ? (
              events[selectedDate.format('YYYY-MM-DD')]?.length ? (
                events[selectedDate.format('YYYY-MM-DD')].map((event, index) => (
                  <Box
                    key={index}
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 1 }}
                  >
                    <Typography variant="body1">
                      {event.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {event.done && <Done sx={{ color: 'green', marginRight: 2 }} />}
                      {!event.done && (
                        <IconButton onClick={() => toggleEventStatus(selectedDate.format('YYYY-MM-DD'), index)}>
                          <Done />
                        </IconButton>
                      )}
                      <IconButton
                        onClick={() => handleDeleteEvent(selectedDate.format('YYYY-MM-DD'), index)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography variant="body1">Aucun événement pour cette date.</Typography>
              )
            ) : (
              <Typography variant="body1">Veuillez sélectionner une date.</Typography>
            )}
          </Box>
        </Box>
      </Box>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="add-event-modal"
        aria-describedby="modal-for-adding-event"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: theme.palette.mode === 'dark' ? '#424242' : '#fff',
            border: '2px solid #000',
            boxShadow: 24,
            padding: 4,
            borderRadius: '8px',
            minWidth: 300,
            color: textColor,
          }}
        >
          <Typography id="add-event-modal" variant="h6" component="h2">
            Ajouter un événement pour le {selectedDate ? selectedDate.format('YYYY-MM-DD') : ''}
          </Typography>
          <TextField
            label="Description"
            fullWidth
            value={eventInput}
            onChange={(e) => setEventInput(e.target.value)}
            sx={{ marginY: 2 }}
          />
          <Button variant="contained" onClick={handleAddEvent} sx={{ bgcolor: '#1976d2' }}>
            Ajouter
          </Button>
        </Box>
      </Modal>
    </LocalizationProvider>
  );
}

export default Calendar;
