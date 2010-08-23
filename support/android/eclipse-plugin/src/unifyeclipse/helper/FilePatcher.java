package unifyeclipse.helper;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Map;
import java.util.Map.Entry;

import org.eclipse.core.resources.IContainer;
import org.eclipse.core.resources.IFile;
import org.eclipse.core.resources.IFolder;
import org.eclipse.core.resources.IProject;
import org.eclipse.core.resources.IResource;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.core.runtime.IProgressMonitor;
import org.eclipse.core.runtime.Status;

import unifyeclipse.builder.UnifyBuilder;

public class FilePatcher {

	private IContainer targetContainer;
	private IProgressMonitor monitor;
	private String[] filesToPatch;

	public FilePatcher(IProject targetProject, String[] filesToPatch, IProgressMonitor monitor) {
		this.targetContainer = targetProject;
		this.monitor = monitor;
		this.filesToPatch = filesToPatch;
	}

	public void patch(Map<String, String> patchValues)
			throws CoreException {
		IResource[] members = targetContainer.members(false);

		for (IResource resource : members) {
			processPatch(resource, targetContainer, patchValues);
		}
	}

	private void processPatch(IResource resource, IContainer folder, Map<String, String> patchValues) throws CoreException {
		if (resource.getType() == IResource.FILE) {
			processFile((IFile)resource, patchValues);
		} else if (resource.getType() == IResource.FOLDER) {
			IFolder fldr = (IFolder) resource;

			for (IResource res : fldr.members(false)) {
				processPatch(res, fldr, patchValues);
			}
		}
	}

	private void processFile(IFile file, Map<String, String> patchValues) throws CoreException {
		if (nameMatches(file)) {
			InputStream stream = file.getContents();
			BufferedReader br = new BufferedReader(new InputStreamReader(stream));
			
			StringBuffer unpatchedFile = new StringBuffer();
			
			try {
				String line;
				while ((line = br.readLine()) != null) {
					unpatchedFile.append(line).append("\n");
				}
				
				stream.close();
				
				String patchedFile = unpatchedFile.toString();
				for (Entry<String,String> entry : patchValues.entrySet()) {
					patchedFile = patchedFile.replaceAll(entry.getKey(), entry.getValue());
				}
				
				InputStream newStream = new ByteArrayInputStream(patchedFile.getBytes());
				file.setContents(newStream, IFile.FORCE, monitor);
				
			} catch (IOException e) {
				throw new CoreException(new Status(Status.ERROR, UnifyBuilder.BUILDER_ID, "Could not read line from file " + file.getName()));
			}
			
		}
	}

	private boolean nameMatches(IFile file) {
		for (String fileMatcher : filesToPatch) {
			if (file.getFullPath().toString().matches(".*" + fileMatcher)) {
				return true;
			}
		}
		return false;
	}

}
