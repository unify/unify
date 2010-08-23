package unifyeclipse;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.lang.reflect.InvocationTargetException;
import java.util.HashMap;
import java.util.Map;

import org.eclipse.core.resources.ICommand;
import org.eclipse.core.resources.IFile;
import org.eclipse.core.resources.IFolder;
import org.eclipse.core.resources.IPathVariableManager;
import org.eclipse.core.resources.IProject;
import org.eclipse.core.resources.IProjectDescription;
import org.eclipse.core.resources.IResource;
import org.eclipse.core.resources.IWorkspaceRoot;
import org.eclipse.core.resources.ResourcesPlugin;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.core.runtime.IPath;
import org.eclipse.core.runtime.IProgressMonitor;
import org.eclipse.core.runtime.Path;
import org.eclipse.core.runtime.SubProgressMonitor;
import org.eclipse.jface.dialogs.MessageDialog;
import org.eclipse.jface.operation.IRunnableWithProgress;
import org.eclipse.jface.viewers.IStructuredSelection;
import org.eclipse.jface.wizard.Wizard;
import org.eclipse.ui.INewWizard;
import org.eclipse.ui.IWorkbench;

import unifyeclipse.helper.Copy;
import unifyeclipse.helper.FilePatcher;

/**
 * Wizard to create android unify project
 * @author s.fastner
 *
 */
public class UnifyAndroidWizard extends Wizard implements INewWizard {

	/**
	 * Selection
	 */
	private IStructuredSelection selection;
	/**
	 * Page to display if new unify project is executed
	 */
	private UnifyAndroidNewWizardPage page;

	/**
	 * Constructor
	 * Tell eclispe to use progress monitor
	 */
	public UnifyAndroidWizard() {
		super();
		setNeedsProgressMonitor(true);
	}

	@Override
	public boolean performFinish() {
		final String containerName = page.getContainerName();
		final String newProjectName = page.getNewProjectName();
		IRunnableWithProgress op = new IRunnableWithProgress() {
			public void run(IProgressMonitor monitor)
					throws InvocationTargetException {
				try {
					doFinish(containerName, newProjectName, monitor);
				} catch (CoreException e) {
					throw new InvocationTargetException(e);
				} finally {
					monitor.done();
				}
			}
		};
		try {
			getContainer().run(true, false, op);
		} catch (InterruptedException e) {
			return false;
		} catch (InvocationTargetException e) {
			Throwable realException = e.getTargetException();
			MessageDialog.openError(getShell(), "Error", realException
					.getMessage());
			return false;
		}
		return true;
	}

	/**
	 * Creates new unify android porject
	 * 
	 * @param containerName Name of unify (javascript) project
	 * @param newProjectName Name of new project
	 * @param monitor Monitor
	 * @throws CoreException
	 */
	private void doFinish(String containerName, String newProjectName,
			IProgressMonitor monitor) throws CoreException {
		monitor.beginTask("Creating " + newProjectName, 2);
		IWorkspaceRoot root = ResourcesPlugin.getWorkspace().getRoot();

		IProject targetProject = root.getProject(newProjectName);

		IProject unifyProject = root.getProject("unify");

		IProjectDescription newProjectDescription = ResourcesPlugin
				.getWorkspace().newProjectDescription("Unify Project");
		newProjectDescription.setNatureIds(getProjectNatures());
		newProjectDescription.setBuildSpec(getBuildSpec(newProjectDescription));
		IProject[] projects = { root.getProject(containerName), unifyProject };
		newProjectDescription.setReferencedProjects(projects);

		targetProject.create(newProjectDescription, new SubProgressMonitor(
				monitor, 10));

		targetProject.open(monitor);

		IPathVariableManager pathMan = ResourcesPlugin.getWorkspace()
				.getPathVariableManager();
		pathMan.setValue("WRKSPC", ResourcesPlugin.getWorkspace().getRoot()
				.getLocation());

		IFolder link = targetProject.getFolder("src-phonegap");
		IPath location = new Path(
				"WRKSPC/unify/external/phonegap-android/framework/src");
		link.createLink(location, IResource.NONE, null);

		IFile classPath = targetProject.getFile(".classpath");
		createClassPathFile(monitor, classPath);

		targetProject.getFolder("gen").create(false, true, monitor);

		copyTemplate(unifyProject, targetProject, monitor);

		monitor.worked(1);
	}

	/**
	 * Copies template with patching of files
	 * 
	 * @param unifyProject
	 * @param targetProject
	 * @param monitor
	 * @throws CoreException
	 */
	private void copyTemplate(IProject unifyProject, IProject targetProject,
			IProgressMonitor monitor) throws CoreException {
		IFolder template = unifyProject.getFolder("support/android/skeleton");

		Copy copyProcess = new Copy(template, targetProject, monitor);
		copyProcess.start();

		String[] filesToPatch = { "strings.xml" };
		Map<String, String> patchValues = new HashMap<String, String>();
		patchValues.put("###appname###",targetProject.getName());

		FilePatcher filePatcher = new FilePatcher(targetProject, filesToPatch,
				monitor);
		filePatcher.patch(patchValues);
	}

	/**
	 * Creates new java class path file
	 * 
	 * @param monitor Monitor
	 * @param classPath Path to class path file
	 * @throws CoreException
	 */
	private void createClassPathFile(IProgressMonitor monitor, IFile classPath)
			throws CoreException {
		StringBuffer sb = new StringBuffer(
				"<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
		sb.append("<classpath>\n");
		sb.append("  <classpathentry kind=\"src\" path=\"src\"/>\n");
		sb.append("  <classpathentry kind=\"src\" path=\"src-phonegap\"/>\n");
		sb.append("  <classpathentry kind=\"src\" path=\"gen\"/>\n");
		sb.append("  <classpathentry kind=\"con\" path=\"com.android.ide.eclipse.adt.ANDROID_FRAMEWORK\"/>\n");
		sb.append("  <classpathentry kind=\"lib\" path=\"../unify/external/phonegap-android/framework/libs/commons-codec-1.3.jar\"/>\n");
		sb.append("  <classpathentry kind=\"output\" path=\"bin\"/>\n");
		sb.append("</classpath>\n");

		InputStream stream = new ByteArrayInputStream(sb.toString().getBytes());
		classPath.create(stream, true, monitor);
	}

	private ICommand getCommand(String commandName, IProjectDescription desc) {
		ICommand command = desc.newCommand();
		command.setBuilderName(commandName);
		return command;
	}

	private ICommand[] getBuildSpec(IProjectDescription desc) {
		ICommand[] commands = {
				getCommand(
						"com.android.ide.eclipse.adt.ResourceManagerBuilder",
						desc),
				getCommand("com.android.ide.eclipse.adt.PreCompilerBuilder",
						desc),
				getCommand("org.eclipse.jdt.core.javabuilder", desc),
				getCommand("com.android.ide.eclipse.adt.ApkBuilder", desc),
				getCommand("UnifyEclipse.unifyBuilder", desc) };

		return commands;
	}

	private String[] getProjectNatures() {
		String[] natures = { "com.android.ide.eclipse.adt.AndroidNature",
				"org.eclipse.jdt.core.javanature", "UnifyEclipse.unifyNature" };
		return natures;
	}

	@Override
	public void addPages() {
		page = new UnifyAndroidNewWizardPage(selection);
		addPage(page);
	}

	@Override
	public void init(IWorkbench workbench, IStructuredSelection selection) {
		this.selection = selection;
	}

}
