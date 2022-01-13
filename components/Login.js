import Head from 'next/head'
import Button from "@material-tailwind/react/Button"
import Image from "next/image"
import { signIn } from "next-auth/client"

function Login() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
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
            <Image objectFit="contain" height={"300"} width={"550"} src={"https://links.papareact.com/1ui"} />

            <Button className="w-44 mt-10" color="blue" buttonType="filled" ripple="light" onClick={signIn}>Login</Button>
        </div>
    )
}

export default Login