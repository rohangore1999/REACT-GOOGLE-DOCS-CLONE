import Button from "@material-tailwind/react/Button";
import Icon from "@material-tailwind/react/Icon"
// to redirect to different page
import { useRouter } from "next/dist/client/router"
import { db } from '../../firebase'
import { useDocumentOnce } from "react-firebase-hooks/firestore"
import { getSession, useSession, signOut, session } from "next-auth/client"
import Login from '../../components/Login'
import TextEditor from "../../components/TextEditor";


function Doc() {
    // getting current user session
    const [session] = useSession()

    // if no session return back to login scree
    if (!session) return <Login />


    // using router, when the user click on doc it will redirect it to particular path
    const router = useRouter()
    const { id } = router.query// router.query.id >> can directly use

    // to pull data from db
    // to get data from particular id of doc
    const [snapshot, loadingSnapshot] = useDocumentOnce(db.collection('userDocs').doc(session.user.email).collection('docs').doc(id))

    if (!loadingSnapshot && !snapshot?.data()?.fileName) {
        // if it is done with loading state and you dont have the filename then replace current url with the home ('/)
        router.replace('/')
    }

    return (
        <div>
            <header className="flex justify-between items-center p-3 pb-1">
                <span className="cursor-pointer" onClick={() => router.push('/')}>
                    {/* router.push >>> as we want the current page in history */}
                    <Icon name='description' size={'5xl'} color='blue' />
                </span>

                <div className="flex-grow px-2">
                    <h2>{snapshot?.data()?.fileName}</h2>
                    <div className="flex items-center text-sm space-x-1 -ml-1 h-8 text-gray-600">
                        <p className='option'>File</p>
                        <p className='option'>Edit</p>
                        <p className='option'>View</p>
                        <p className='option'>Insert</p>
                        <p className='option'>Format</p>
                        <p className='option'>Tools</p>
                    </div>
                </div>

                <Button color='lightBlue' buttonType='filled' size='regular' className='hidden md:!inline-flex h-10' rounded={false} block={false} iconOnly={false} ripple='light'
                >
                    <Icon name={'people'} size={'md'} />
                    Share
                </Button>

                <img src={session.user.image} className="hidden lg:!inline-grid rounded-full cursor-pointer h-10 w-10 ml-2" />
            </header>


            {/* Text Editor */}
            <TextEditor />
        </div>
    )
}

export default Doc


// IF HAVE CREATE DIFFERENT PAGE JUST LIKE [id].js THEN ADD THIS PIECE OF CODE IN THAT SO THAT TO EXPERIENCE THE SERVER SIDE RENDERING

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