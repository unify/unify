package unifyeclipse.helper;

import org.eclipse.core.resources.IContainer;
import org.eclipse.core.resources.IFolder;
import org.eclipse.core.resources.IResource;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.core.runtime.IPath;
import org.eclipse.core.runtime.IProgressMonitor;
import org.eclipse.core.runtime.Path;

public class Copy {
	private IFolder sourceDir;
	private IContainer targetDir;
	private IProgressMonitor monitor;

	public Copy(IFolder sourceDir, IContainer targetDir, IProgressMonitor monitor) {
		this.sourceDir = sourceDir;
		this.targetDir = targetDir;
		this.monitor = monitor;
	}
	
	public void start() throws CoreException {
		IResource[] members = sourceDir.members(false);
		for (IResource resource : members) {
			doCopyTemplate(resource, targetDir, monitor);
		}
	}
	
	private void doCopyTemplate(IResource resource, IContainer folder, IProgressMonitor monitor) throws CoreException {
		if (resource.getType() == IResource.FILE) {
			IPath toFile = folder.getFullPath().append(resource.getName());
			resource.copy(toFile, true, monitor);
		} else if (resource.getType() == IResource.FOLDER) {
			IFolder fldr = (IFolder) resource;
			IResource[] members = fldr.members(false);
			
			IFolder newFolder = folder.getFolder(new Path(resource.getName()));
			newFolder.create(false, true, monitor);
			
			for (IResource res : members) {
				doCopyTemplate(res, newFolder, monitor);
			}
		}
	}
}
