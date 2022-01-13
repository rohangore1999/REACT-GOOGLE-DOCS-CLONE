import Button from "@material-tailwind/react/Button";
import Icon from "@material-tailwind/react/Icon"

// to redirect to different page
import { useRouter } from "next/dist/client/router"


function DocumentRow({ id, fileName, date }) {
    // using router, when the user click on doc it will redirect it to particular path
    const router = useRouter()

    return (
        // onclick on div, will redirect to /doc/{id} of particular doc
        <div onClick={()=>router.push(`/doc/${id}`)} className="flex items-center p-4 rounded-lg hover:bg-gray-100 text-gray-700 text-sm cursor-pointer">
            <Icon name="article" size="3xl" color='blue' />

            {/* truncate >>> if length of text is more then it will show '....' */}
            <p className="flex-grow pl-5 w-10 pr-10 truncate">{fileName}</p>
            <p className="pr-5 text-sm">{date?.toDate().toLocaleDateString()}</p>

            <Button color="gray" buttonType="outline" iconOnly={true} rounded={true} ripple="dark" className="border-0">
              <Icon name="more_vert" size="3xl" />
            </Button>
        </div>
    )
}

export default DocumentRow
