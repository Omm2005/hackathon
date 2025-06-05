import React from 'react'

type Props = {
  params: {
    id: string;
  };
  searchParams: {
    query?: string;
  };
}

const page = ({ params, searchParams }: Props) => {
  const { id } = params
  const { query } = searchParams

  return (
    <div>
      <h1>Workflow {id}</h1>
      {query && <p>Query: {query}</p>}
    </div>
  )
}

export default page