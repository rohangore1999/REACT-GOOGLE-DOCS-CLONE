import Head from 'next/head'
import Header from '../components/Header'
import Login from '../components/Login'
import Button from "@material-tailwind/react/Button";
import Icon from "@material-tailwind/react/Icon"
import Image from 'next/image';
import { getSession, useSession } from "next-auth/client"

// for modal
import Modal from "@material-tailwind/react/Modal"
import ModalBody from "@material-tailwind/react/ModalBody"
import ModalFooter from "@material-tailwind/react/ModalFooter"
import { useState } from 'react';

import { db } from '../firebase'
import firebase from 'firebase';

import { useCollectionOnce } from "react-firebase-hooks/firestore"

import DocumentRow from '../components/DocumentRow'


export default function Home() {
  // loading session
  // in this session we are getting the user details from app.js
  const [session] = useSession()
  // console.log(session)
  // checking if no session then redirect to login component; else load our App
  if (!session) return <Login />

  // state to keep track if the modal is open or close
  const [showModal, setShowModal] = useState(false); //by default it is close

  // for input of Modal
  const [input, setInput] = useState("")

  const createDocument = () => {
    // to create document
    if (!input) return; //if no input simply return

    // our db structure:-
    //  userDocs >>> {userEmail who logged in} >>> docs >>> {add our object data}
    db.collection('userDocs').doc(session.user.email).collection('docs').add({
      fileName: input,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })

    setInput("")
    setShowModal(false)
  }

  const modal = (
    <Modal
      size="sm" //small
      active={showModal} //to show or not depend on state
      toggler={() => setShowModal(false)} //setShowModal will return so we user () => arrow func, also we are setting it to false because if it click outside then it should close
    >


      {/* body of Modal */}
      <ModalBody>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type={"text"}
          className='outline-none w-full'
          placeholder='Enter name of document...'
          onKeyDown={(e) => e.key === "Enter" && createDocument()} //it will call the createDocument() if we click enter
        />
      </ModalBody>

      {/* footer of Modal */}
      <ModalFooter>
        <Button
          color="blue"
          buttonType="link"
          onClick={(e) => setShowModal(false)} // when you click cancel button model false
          ripple="dark"
        >
          Cancel
        </Button>

        <Button color="blue" onClick={createDocument} ripple={'light'}>
          Create
        </Button>
      </ModalFooter>
    </Modal>
  )


  // to pull data from Firebase we import useCollectionOnce
  // we are visiting the data which we want:
  // db(userDocs) >>> {user.email} >>> docs <<== it will give the data from this colltion, order by decs of timestamp
  const [snapshot] = useCollectionOnce(db.collection('userDocs').doc(session.user.email).collection('docs').orderBy('timestamp', 'desc'))

  return (
    <div>
      <Head>
        <title>Google Docs Clone</title>
        <link rel="icon" href="/favicon.ico" />

        {/* for post picture */}
        <meta property="og:title" content="" />
        <meta property="og:type" content="" />
        <meta property="og:image" content="/favicon_logo.png" />
        <meta name="twitter:card" content="summary_large_image" />

        <meta property="og:description" content="" />
        <meta name="twitter:image:alt" content="" />
      </Head>

      <Header />
      {modal} {/* it will be under header; and when the state it true it will show; else not */}

      {/* listing documents */}
      <section className='bg-[#F8F9FA] pb-10 px-10'>
        <div className='max-w-3xl mx-auto'>
          <div className='py-6 flex items-center justify-between'>
            <h2 className='text-gray-700 text-lg'>Start a new document</h2>
            <Button color="gray" buttonType="outline" iconOnly={true} ripple="dark" className="border-0">
              <Icon name="more_vert" size="3xl" />
            </Button>
          </div>

          {/* doc image */}
          {/* next js Image >>> convert img to web p and compress */}
          <div>
            {/* when you click on Image of create doc we will set modal to true */}
            <div onClick={() => setShowModal(true)} className='relative h-52 w-40 border-2 cursor-pointer hover:border-blue-700'>
              <Image src={"https://links.papareact.com/pju"} layout='fill' />
            </div>

            <p className='ml-2 mt-2 font-semibold text-sm text-gray-700'>Blank</p>
          </div>
        </div>
      </section>

      <section className='bg-white px-10 md:px-0'>
        <div className='max-w-3xl mx-auto py-8 text-sm text-gray-700'>
          <div className='flex items-center justify-between pb-5'>
            <h2 className='font-medium flex-grow'>My Documents</h2>
            <p className='mr-12'>Date Created</p>
            <Icon name='folder' size='3xl' color='gray' />
          </div>
          {snapshot?.docs.map((doc) => (
            <DocumentRow key={doc.id} id={doc.id} fileName={doc.data().fileName} date={doc.data().timestamp} />
          ))}
        </div>
      </section>



    </div>
  )
}

// for server side rendering
export async function getServerSideProps(context) {
  // context >>> the request(all the information) which user sent
  // getting the user Loggedin session at that moment in server side rendering part
  // as useSession is the hook we cant use here as this is the nodejs part so we use getSession()
  const session = await getSession(context)

  // now we return the object as a props from NodeJs to ReactJs
  return {
    props: {
      session,
    }
  }
}