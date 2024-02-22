import { ChangeEvent, useState } from 'react'
import logo from './assets/logo-nlw-expert.svg'
import { NewNoteCard } from './components/new-note-card'
import { NoteCard } from './components/note-card'

interface Note {
  id: string
  date: Date
  content: string
}

export function App() {
  const [search, setSearch] = useState('')
  const [notes, setNotes] = useState<Note[]>(() => { // <Note[]> = Esse array é do formato Note // Informa o formato das informações que serão salvas
    const notesOnStorage = localStorage.getItem('notes')

    if (notesOnStorage) {
      return JSON.parse(notesOnStorage)
    }
    
    return []
  }) 

  function onNoteCreated(content: string){
    const newNote = {
      id: crypto.randomUUID(), // gera um ID único universal em formato de string
      date: new Date(),
      content,
    }

    const notesArray = [newNote, ...notes] 

    setNotes(notesArray) // criar um novo array com a nova nota criada + todas as notas já criadas 

    localStorage.setItem('notes', JSON.stringify(notesArray)) // JSON.stringify = converte algo em uma string
  }

  function onNoteDeleted(id: string){
    const notesArray = notes.filter(note => {
      return note.id !== id
    })

    setNotes(notesArray)

    localStorage.setItem('notes', JSON.stringify(notesArray))
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>){
    const query = event.target.value

    setSearch(query)
  }

  const filteredNotes = search !== '' 
  ? notes.filter(note => note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase())) // verifica se o conteúdo da nota inclui o que foi escrito no input de busca
  : notes                                                        // .toLocaleLowerCase() = muda para letra minúscula


  return (
    <div className='mx-auto my-12 max-w-6xl space-y-6 px-5'>
      <img src={logo} alt="logo" />

      <form className='w-full'>
        <input
          type="text"
          placeholder='Busque em suas notas...'
          className='w-full bg-transparent text-3xl font-semibold tracking-tight outline-none cursor-pointer placeholder:text-slate-500'
          onChange={handleSearch}
        />
      </form>

      <div className='h-px bg-slate-700' />  { /* separador */}

      {/* no tailwind criamos os estilos para telas menores e vamos alterando-os para telas maiores  */}
      {/* resumindo, começamos criando os estilos que serão aplicados para telas 'mobile' e depois para telas maiores */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]'>
        { /* quando quiser especifiar um valor próprio use colchetes e o valor */}

        <NewNoteCard onNoteCreated={onNoteCreated} />

        {filteredNotes.map(note => {
          return <NoteCard key={note.id} note={note} onNoteDeleted={onNoteDeleted} />
        })}

      </div>
    </div>
  )
}
