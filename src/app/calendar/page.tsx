'use client';

import { Calendar, momentLocalizer, View } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { Container, Col, Row } from 'react-bootstrap';


const localizer = momentLocalizer(moment);

type Todo = {
  id: number;
  title: string;
  description?: string;
  createdAt: string;
};

type CalendarEvent = {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
};

const fetchTodos = async (): Promise<Todo[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/todo`);
  return res.json();
};

export default function CalendarView() {
  const { data: todos = [] } = useQuery<Todo[]>({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });

  // Używamy stringów typu 'month', 'week', 'day' zgodnych z react-big-calendar
  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState(new Date());

  const events: CalendarEvent[] = useMemo(() => {
    return todos
      .filter((todo) => todo.title && todo.createdAt)
      .map((todo) => ({
        title: todo.title,
        start: new Date(todo.createdAt),
        end: new Date(todo.createdAt),
        allDay: true,
      }));
  }, [todos]);

  return (
    <>
      <DashboardHeader/>
      <Container style={{ paddingTop: '2rem' }}>
    <Row className="justify-content-center">
      <Col md={12} lg={12}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={['month', 'week', 'day']}
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          style={{
            height: 600,
            backgroundColor: '#ffffff',
            padding: '1rem',
            borderRadius: '12px',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)'
          }}
        />
      </Col>
    </Row>
  </Container>
    </>
  );
}
