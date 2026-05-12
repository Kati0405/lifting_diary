'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from 'sonner';
import { createWorkoutAction } from './actions';

export default function NewWorkoutForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [calOpen, setCalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    try {
      const result = await createWorkoutAction({ name, startedAt: date });
      if (result.error) {
        setError('Failed to create workout. Please try again.');
      } else {
        toast.success('Workout created!');
        router.push('/dashboard');
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
      <div className='flex flex-col gap-2'>
        <Label htmlFor='name'>Workout name</Label>
        <Input
          id='name'
          placeholder='e.g. Upper body'
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={pending}
        />
      </div>

      <div className='flex flex-col gap-2'>
        <Label>Date</Label>
        <Popover open={calOpen} onOpenChange={setCalOpen}>
          <PopoverTrigger
            disabled={pending}
            className='inline-flex w-full items-center justify-start gap-2 rounded-lg border border-border bg-background px-2.5 h-8 text-sm font-normal hover:bg-muted transition-colors disabled:pointer-events-none disabled:opacity-50'
          >
            <CalendarIcon className='h-4 w-4 text-zinc-500' />
            {format(date, 'do MMM yyyy')}
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0' align='start'>
            <Calendar
              mode='single'
              selected={date}
              onSelect={(d) => {
                if (d) {
                  setDate(d);
                  setCalOpen(false);
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {error && <p className='text-sm text-red-500'>{error}</p>}

      <div className='flex gap-3'>
        <Button type='submit' disabled={pending || !name.trim()}>
          {pending ? 'Saving…' : 'Create workout'}
        </Button>
        <Button
          type='button'
          variant='ghost'
          onClick={() => router.back()}
          disabled={pending}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
