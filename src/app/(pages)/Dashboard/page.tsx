'use client'
import { addBlogItem, checkToken, deleteBlogItem, getBlogItemsByUserId, getToken, loggedInData, upDateBlogItem } from '@/utils/DataServices';
import React, { useEffect, useState } from 'react'
import { Button, Dropdown, DropdownItem, FileInput, Label, Modal, ModalBody, ModalFooter, ModalHeader, TextInput, Accordion, AccordionContent, AccordionPanel, AccordionTitle, ListGroup } from 'flowbite-react'
import { IBlogItems } from '@/utils/Interfaces';
import BlogEntries from "@/utils/BlogEntries.json"
import { disconnect } from 'process';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';


const page = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  //These useStates will be for our Form

  const [blogTitle, setBlogTitle] = useState<string>("");
  const [blogImage, setBlogImage] = useState<any>();
  const [blogDescription, setBlogDescription] = useState<string>("");
  const [blogCategory, setBlogCategory] = useState<string>("");
  const [blogId, setBlogId] = useState<number>(0);
  const [blogUserId, setBlogUserId] = useState<number>(0);
  const [blogPublisherName, setBlogPublisherName] = useState<string>("");

  const [edit, setEdit] = useState<boolean>(false);

  const [blogItems, setBlogItems] = useState<IBlogItems[]>(BlogEntries);

  const router = useRouter();

  useEffect(() => {

    const getLoggedInData = async () => {
      //Get the user's info
      const loggedIn = loggedInData();
      console.log(loggedIn);
      setBlogUserId(loggedIn.id);
      setBlogPublisherName(loggedIn.username);

      //Get the user's Blog Items
      const userBlogItems = await getBlogItemsByUserId(loggedIn.id, getToken());
      console.log(userBlogItems);
      
      //Set user's blog items inside of our useState
      setBlogItems(userBlogItems);
    }


    if (!checkToken()) {
      //Push to Login Page
      router.push('/');

    } else {
      //Get User Data / Login Logic function
      getLoggedInData();
    }
  }, [])

  // ----------------Form Functions--------------------------------

  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => setBlogTitle(e.target.value);

  const handleDescription = (e: React.ChangeEvent<HTMLInputElement>) => setBlogDescription(e.target.value);

  const handleCategory = (categories: string) => setBlogCategory(categories);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    //We are creating a new file reader object
    let reader = new FileReader();

    //Then we are going to get the first file to select
    let file = e.target.files?.[0]

    //ANd if there a file to select
    if (file){
      //When this file is turned into a string this onload funciton will run
      reader.onload = () => {
        setBlogImage(reader.result); //Once the file is read we will store the reuslt into our setter
      }
      reader.readAsDataURL(file); //This converts our file to a base64-encoded string
    }

  };

  //------------------Accordian Functions----------------------

  const handleShow = () => {
    setOpenModal(true);
    setEdit(false);
    setBlogId(0);
    setBlogUserId(blogUserId);
    setBlogPublisherName(blogPublisherName);
    setBlogTitle("");
    setBlogDescription("");
    setBlogImage("");
    setBlogCategory("");
  }

  const handleEdit = (items: IBlogItems) => {
    setOpenModal(true);
    setEdit(true);
    setBlogId(items.id);
    setBlogUserId(items.userId);
    setBlogPublisherName(items.publisherName);
    setBlogTitle(items.title);
    setBlogDescription(items.description);
    setBlogImage(items.image);
    setBlogCategory(items.category);
  };

  const handlePublish = async (items: IBlogItems) => {
    items.isPublished = !items.isPublished;

    let result = await upDateBlogItem(items, getToken());
    
    if(result){
      let userBlogItems = await getBlogItemsByUserId(blogUserId, getToken());
      setBlogItems(userBlogItems);
    }else{
      alert("Blog was not published");
    }
  };

  const handleDelete = async (items: IBlogItems) => {
    items.isDeleted = true;

    let result = await deleteBlogItem(items, getToken());

    if(result){
      let userBlogItems = await getBlogItemsByUserId(blogUserId, getToken());
      setBlogItems(userBlogItems);
    }else{
      alert("Blog item(s) was not deleted");
    }
  };

  //--------Save Function---------

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const item: IBlogItems = {
      id: blogId,
      userId: blogUserId,
      publisherName: blogPublisherName,
      title: blogTitle,
      description: blogDescription,
      image: blogImage,
      category: blogCategory,
      date: format(new Date(), 'MM/dd/yyyy'),
      isPublished: e.currentTarget.textContent === 'Save' ? false : true,
      isDeleted: false
    }
    setOpenModal(false);

    let result = false;



    if (edit) {
      //Our edit logic will go here
      result = await upDateBlogItem(item, getToken());

    } else {
      //Our Add Logic will go here
      result = await addBlogItem(item, getToken());

    }

    if(result){
      let userBlogItems = await getBlogItemsByUserId(blogUserId, getToken());
      setBlogItems(userBlogItems);

    }else{
      alert(`Blog items wer not ${edit ? 'Updated' : 'Added'}`);

    }
  };


  return (
    <main className='flex min-h-screen flex-col p-24'>
      <div className='flex flex-col items-center mb-10'>
        <h1 className='text-center text-3xl'>Dashboard Page</h1>

        <Button onClick={handleShow}>Add Blog</Button>
        <Modal show={openModal} onClose={() => setOpenModal(false)}>
          <ModalHeader>{edit ? 'Edit Blog Post' : 'Add Blog Post'}</ModalHeader>
          <ModalBody>
            <form className="flex max-w-md flex-col gap-4">
              <div>
                <div className="mb-2 block">
                  {/* Title, Image, Description Category, Tags */}
                  <Label htmlFor="Title">Title</Label>
                </div>
                <TextInput id="Title" type="text" placeholder="Title" required onChange={handleTitle} />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="description">Description</Label>
                </div>
                <TextInput id="Description" placeholder='Description' type="text" required onChange={handleDescription} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Dropdown label="Categories" dismissOnClick={true}>
                    <DropdownItem onClick={() => handleCategory("Jiu Jitsu")}>Jiu Jitsu</DropdownItem>
                    <DropdownItem onClick={() => handleCategory("Boxing")}>Boxing</DropdownItem>
                    <DropdownItem onClick={() => handleCategory("Kung Fu")}>Kung Fu</DropdownItem>
                  </Dropdown>
                </div>
                <div className="mb-2 block">
                  <Label htmlFor="Image">Image</Label>
                </div>
                <FileInput onChange={handleImage} id="Picture" accept="image/png, image/jpg" placeholder="Chose Picture" />
              </div>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleSave}>Save and publish</Button>
            <Button onClick={handleSave}>Save</Button>
            <Button color="gray" onClick={() => setOpenModal(false)}>Cancel</Button>
          </ModalFooter>
        </Modal>

        <Accordion alwaysOpen className="w-3xl mt-5">
          <AccordionPanel>
            <AccordionTitle>Published Blog Items</AccordionTitle>
            <AccordionContent>
              <ListGroup>
                {
                  blogItems.map((item: IBlogItems, idx: number) => {
                    return (
                      <div key={idx}>
                        {
                          item.isPublished && !item.isDeleted && (
                            <div className='flex flex-col p-10'>
                              <h2 className='text-3xl'>{item.title}</h2>
                              <div className='flex flex-row space-x-3'>
                                <Button color="blue" onClick={() => handleEdit(item)}>Edit</Button>
                                <Button color="red" onClick={() => handleDelete(item)}>Delete</Button>
                                <Button color="yellow" onClick={() => handlePublish(item)}>Unpublish</Button>
                              </div>
                            </div>
                          )
                        }
                      </div>
                    )
                  })
                }
              </ListGroup>
            </AccordionContent>
          </AccordionPanel>
          <AccordionPanel>
            <AccordionTitle>Unpublished Blog Items</AccordionTitle>
            <AccordionContent>
              <ListGroup>
                {
                  blogItems.map((item: IBlogItems, idx: number) => {
                    return (
                      <div key={idx}>
                        {
                          !item.isPublished && !item.isDeleted && (
                            <div className='flex flex-col p-10'>
                              <h2 className='text-3xl'>{item.title}</h2>
                              <div className='flex flex-row space-x-3'>
                                <Button color="blue" onClick={() => handleEdit(item)}>Edit</Button>
                                <Button color="red" onClick={() => handleDelete(item)}>Delete</Button>
                                <Button color="yellow" onClick={() => handlePublish(item)}>Unpublish</Button>
                              </div>
                            </div>
                          )
                        }
                      </div>
                    )
                  })
                }

              </ListGroup>
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
      </div>

    </main>

  )
}

export default page
