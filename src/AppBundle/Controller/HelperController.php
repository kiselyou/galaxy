<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Helper;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

/**
 * Helper controller.
 *
 */
class HelperController extends Controller
{
    /**
     * Lists all helper entities.
     *
     */
    public function indexAction($page)
    {
        $em = $this->getDoctrine()->getManager();

        $helpers = $em->getRepository('AppBundle:Helper')->findAll();

        return $this->render('helper/index.html.twig', array(
            'helpers' => $helpers,
            'pagination' => [
                'count' => 10,
                'page' => $page,
                'route' => 'helper_index'
            ]
        ));
    }

    /**
     * Creates a new helper entity.
     *
     */
    public function newAction(Request $request)
    {
        $helper = new Helper();
        $form = $this->createForm('AppBundle\Form\HelperType', $helper);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($helper);
            $em->flush($helper);

            return $this->redirectToRoute('helper_show', array('id' => $helper->getId()));
        }

        return $this->render('helper/new.html.twig', array(
            'helper' => $helper,
            'form' => $form->createView(),
        ));
    }

    /**
     * Finds and displays a helper entity.
     *
     */
    public function showAction(Helper $helper)
    {
        $deleteForm = $this->createDeleteForm($helper);

        return $this->render('helper/show.html.twig', array(
            'helper' => $helper,
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Displays a form to edit an existing helper entity.
     *
     */
    public function editAction(Request $request, Helper $helper)
    {
        $deleteForm = $this->createDeleteForm($helper);
        $editForm = $this->createForm('AppBundle\Form\HelperType', $helper);
        $editForm->handleRequest($request);

        if ($editForm->isSubmitted() && $editForm->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('helper_edit', array('id' => $helper->getId()));
        }

        return $this->render('helper/edit.html.twig', array(
            'helper' => $helper,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Deletes a helper entity.
     *
     */
    public function deleteAction(Request $request, Helper $helper)
    {
        $form = $this->createDeleteForm($helper);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->remove($helper);
            $em->flush();
        }

        return $this->redirectToRoute('helper_index');
    }

    /**
     * Creates a form to delete a helper entity.
     *
     * @param Helper $helper The helper entity
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm(Helper $helper)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('helper_delete', array('id' => $helper->getId())))
            ->setMethod('DELETE')
            ->getForm()
        ;
    }
}
