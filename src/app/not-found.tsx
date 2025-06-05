import React from 'react'

type Props = {}

const notFound = (props: Props) => {
  return (
    <div>not-found</div>
  )
}

export default notFound
export async function generateMetadata() {
  return {
    title: "Page Not Found",
    description: "The page you are looking for does not exist.",
  };
}