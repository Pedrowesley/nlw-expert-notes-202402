import { ChangeEvent, useEffect, useState } from 'react';
import logo from './assets/logo-nlw-expert.svg';
import { NewNoteCard } from './components/new-note-card';
import { NoteCard, NoteCardProps } from './components/note-card';

export function App() {
  const [notes, setNotes] = useState<NoteCardProps[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNotes, setFilteredNotes] = useState<NoteCardProps[]>([]);

  const LOCAL_STORAGE_KEY = 'notes';

  useEffect(() => {
    const storedNotes = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    }
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filteredNotes = notes.filter((note) =>
      note.note.content.toLowerCase().includes(query),
    );

    setFilteredNotes(filteredNotes);
  }, [searchQuery, notes]);

  function onNoteCreated(content: string) {
    const newNote = {
      note: {
        id: crypto.randomUUID(),
        date: new Date(),
        content,
      },
    };

    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedNotes));
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    setSearchQuery(event.target.value);
  }

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6">
      <img src={logo} alt="NLW Expert" />

      <form className="w-full">
        <input
          type="text"
          placeholder="Busque em suas notas..."
          className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-state-500"
          onChange={handleSearch}
        />
      </form>

      <div className="h-px bg-slate-700" />

      <div className="grid grid-cols-3 gap-6 auto-rows-[250px]">
        <NewNoteCard onCreate={onNoteCreated} />

        {filteredNotes.map((note) => (
          <NoteCard key={note.note.id} note={note.note} />
        ))}
      </div>
    </div>
  );
}
