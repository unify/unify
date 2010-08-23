package unifyeclipse.builder;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import org.eclipse.core.resources.IContainer;
import org.eclipse.core.resources.IFile;
import org.eclipse.core.resources.IFolder;
import org.eclipse.core.resources.IProject;
import org.eclipse.core.resources.IResource;
import org.eclipse.core.resources.IResourceDelta;
import org.eclipse.core.resources.IResourceDeltaVisitor;
import org.eclipse.core.resources.IResourceVisitor;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.core.runtime.IProgressMonitor;
import org.eclipse.core.runtime.IStatus;
import org.eclipse.core.runtime.Path;
import org.eclipse.core.runtime.Status;

import unifyeclipse.helper.Copy;

public class UnifyBuildVisitor implements IResourceVisitor,
		IResourceDeltaVisitor {

	private IProgressMonitor monitor;
	private IProject project;

	public UnifyBuildVisitor(IProgressMonitor monitor, IProject iProject) {
		this.monitor = monitor;
		this.project = iProject;
	}

	@Override
	public boolean visit(IResource resource) throws CoreException {
		monitor.subTask("Unify build process");
		try {

			UnifyBuildHelper.runBuild(UnifyBuildHelper
					.getUnifyApplicationProject(project).getLocation());
		} catch (IOException e) {

			throw new CoreException(new Status(Status.ERROR,
					UnifyBuilder.BUILDER_ID, "Python not running", e));
		}
		copyBuildToTargetProject();
		return false;
	}

	@Override
	public boolean visit(IResourceDelta delta) throws CoreException {
		monitor.subTask("Unify build process");
		try {
			UnifyBuildHelper.runBuild(UnifyBuildHelper
					.getUnifyApplicationProject(project).getLocation());
		} catch (IOException e) {
			throw new CoreException(new Status(Status.ERROR,
					UnifyBuilder.BUILDER_ID, "Python not running", e));
		}
		copyBuildToTargetProject();
		return false;
	}

	private void copyBuildToTargetProject() throws CoreException {
		monitor.subTask("Copy build to target project");

		IProject targetProject = this.project;
		IProject unifyApplicationProject = UnifyBuildHelper
				.getUnifyApplicationProject(targetProject);
		IProject phonegapProject = UnifyBuildHelper
				.getUnifyProject(targetProject);

		unifyApplicationProject.refreshLocal(IResource.DEPTH_INFINITE, monitor);

		// Copy icon to all phonegap locations
		IFile icon = unifyApplicationProject
				.getFile("support/android/icon.png");
		copyResource(icon, targetProject.getFile("res/drawable-hdpi/icon.png"));
		copyResource(icon, targetProject.getFile("res/drawable-ldpi/icon.png"));
		copyResource(icon, targetProject.getFile("res/drawable-mdpi/icon.png"));

		// Copy strings.xml
		IFile strings = unifyApplicationProject
				.getFile("support/android/strings.xml");
		IFile stringsTarget = targetProject.getFile("res/values/strings.xml");
		copyResource(strings, stringsTarget);

		// Delete assets dir
		IContainer targetDir = targetProject.getFolder("assets/www");
		
		for (IResource member : targetDir.members()) {
			member.delete(true, monitor);
		}
		
		// Copy phonegap javascript build
		IFolder phonegapJsTargetDir = targetProject.getFolder("assets/www");
		IContainer phonegapJsBaseDir = phonegapProject
				.getFolder("external/phonegap-android/framework/assets/js");
		try {
			copyJavascript(phonegapJsBaseDir, phonegapJsTargetDir);
		} catch (IOException e) {
			throw new CoreException(new Status(IStatus.ERROR, UnifyBuilder.BUILDER_ID, e.getMessage()));
		}

		// Copy unify build
		IFolder template = unifyApplicationProject.getFolder("build/phonegap");
		Copy copyProcess = new Copy(template, targetDir, monitor);
		copyProcess.start();
	}

	private void copyJavascript(IContainer phonegapJsBaseDir,
			IFolder phonegapJsTargetDir) throws CoreException, IOException {
		IResource[] members = phonegapJsBaseDir.members();
		StringBuffer sb = new StringBuffer();
		
		IFile phonegapBase = phonegapJsBaseDir.getFile(new Path("phonegap.js.base"));
		phonegapBase.copy(phonegapJsTargetDir.getFile("phonegap.js").getFullPath(), true, monitor);
		
		for (IResource res : members) {
			if ((res.getType() == IResource.FILE) && (res.getFileExtension().equals("js"))) {
				InputStream stream = ((IFile) res).getContents();
				BufferedReader br = new BufferedReader(new InputStreamReader(stream));
				String line;
				while ((line = br.readLine()) != null) {
					sb.append(line);
					sb.append("\n");
				}
				br.close();
			}
		}
		ByteArrayInputStream outStream = new ByteArrayInputStream(sb.toString().getBytes());
		phonegapJsTargetDir.getFile("phonegap.js").appendContents(outStream, true, false, monitor);
	}

	private void copyResource(IFile source, IFile target) throws CoreException {
		if (target.exists()) {
			target.delete(true, monitor);
		}
		source.copy(target.getFullPath(), true, monitor);
	}

}
