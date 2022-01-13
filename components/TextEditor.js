import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
// to get id from url
import { useRouter } from "next/dist/client/router"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

// when we create state; by default we cant keep it any type('', null, etc..)
import { EditorState } from "draft-js";
import { db } from "../firebase";
import { session } from "next-auth/client";

import { convertFromRaw, convertToRaw } from "draft-js";
import { useSession } from "next-auth/client"

// to pull data from firebase db
import { useDocumentOnce } from "react-firebase-hooks/firestore"



// import { Editor } from "react-draft-wysiwyg";

// we can simply import above editor in Next.Js it will give window error
// because as in Next.Js we have ServerSideRendering so our server is running on Node.Js and after that in Javascript... so window is only work with javascript but not with node so to disable Editor module on SSR we import like below. As Editor is not a default module, it contain lots of module so we are taking out only necesary one.

const Editor = dynamic(() => import('react-draft-wysiwyg').then((module) => module.Editor), { ssr: false })

function TextEditor() {
    // to store the state
    // when we create state; by default we cant keep it any type('', null, etc..)
    // so need to define default state from EditorState
    const [editorState, setEditorState] = useState(EditorState.createEmpty())


    // to get the current user's data
    const [session] = useSession()

    // using router, when the user click on doc it will redirect it to particular path
    const router = useRouter()
    const { id } = router.query// router.query.id >> can directly use

    // pulling the data from firebase
    const [snapshot] = useDocumentOnce(db.collection('userDocs').doc(session.user.email).collection('docs').doc(id))

    // using useEffect so that when the page reload the components loads it will pull the data first before firebase get update
    useEffect(() => {
        // checking if we have editorState field in our db
        if (snapshot?.data()?.editorState) {
            // we are converting the RAW JSON to normal form
            setEditorState(
                EditorState.createWithContent(
                    convertFromRaw(snapshot?.data()?.editorState)
                )
            );
        }
    }, [snapshot])



    // same as we do for input field, to appear text when key press, it will overwrite
    const onEditorStateChange = (editorState) => {
        setEditorState(editorState)

        // to store what we do changes in docs
        db.collection('userDocs').doc(session.user.email).collection('docs').doc(id).set({
            // to store data in 'editorState' field
            // as we can simply store data from states, so we convert it to RAW JSON the current editor state
            editorState: convertToRaw(editorState.getCurrentContent())
        }, {
            merge: true //to append the data instead of overwriting
        })
    }

    

    // console.log(editorState)


    return (
        <div className="bg-[#F8F9FA] min-h-screen pb-16">
            <Editor
                // to store the state(else by refreshing it will erase)
                editorState={editorState}
                // mapping so that text apprears
                onEditorStateChange={onEditorStateChange}
                // !justify-center >> to overwrite the already present css; and we make toolbar sticky
                toolbarClassName='flex sticky top-0 z-50 !justify-center mx-auto'
                // editorClassnName >> body
                editorClassName="mt-6 bg-white shadow-lg max-w-5xl mx-auto mb-12 border p-10"
            />
        </div>
    )
}

export default TextEditor
