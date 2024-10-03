import React from 'react'
import Accordion from '../components/Accordion'

const TotalExpenses = ({personalExpenses, currency}) => {
  return (
    <div className='padding-y padding-x section-margin-y border-[1px] rounded shadow-lg bg-slate-50'>
      <Accordion title='Total expenses' description={personalExpenses} currency={currency}/>
    </div>
  )
}

export default TotalExpenses
