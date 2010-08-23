package unifyeclipse.builder;

import java.io.IOException;
import java.util.Map;

import org.eclipse.core.resources.IProject;
import org.eclipse.core.resources.IResourceDelta;
import org.eclipse.core.resources.IncrementalProjectBuilder;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.core.runtime.IProgressMonitor;
import org.eclipse.core.runtime.Status;
import org.eclipse.ui.console.MessageConsoleStream;

/**
 * Unify project builder (executed generate.py script)
 * @author s.fastner
 *
 */
public class UnifyBuilder extends IncrementalProjectBuilder {

	public static final String BUILDER_ID = "UnifyEclipse.unifyBuilder";
	private static final String[] BUILD_TRIGGER = { "/res", "/src",
			"/src-phonegap" };
	private static final String[] BUILD_REFERENCED_TRIGGER = { "/source" };

	@SuppressWarnings("unchecked")
	@Override
	protected IProject[] build(int kind, Map args, IProgressMonitor monitor)
			throws CoreException {
		if ((kind == AUTO_BUILD) || (kind == INCREMENTAL_BUILD)) {
			IResourceDelta delta = getDelta(getProject());
			if (delta == null) {
				fullBuild(monitor);
			} else {
				IResourceDelta[] childs = delta.getAffectedChildren();
				boolean build = false;
				if (childs.length == 0) {
					for (IProject referencedProject : getProject().getReferencedProjects()) {
						IResourceDelta newDelta = getDelta(referencedProject);
						if (newDelta != null) {
							build = checkProjectDelta(newDelta.getAffectedChildren(), BUILD_REFERENCED_TRIGGER, referencedProject);
						}
						if (build) {
							break;
						}
					}
					if (build) {
						fullBuild(monitor);
					}
				} else {
					build = checkProjectDelta(childs, BUILD_TRIGGER, getProject());
					if (build) {
						incrementalBuild(delta, monitor);
					}
				}
			}
		} else if (kind == FULL_BUILD) {
			fullBuild(monitor);
		} else {
			throw new CoreException(new Status(Status.WARNING, BUILDER_ID,
					"Unknown build kind : " + kind));
		}

		return getProject().getReferencedProjects();
	}

	private boolean checkProjectDelta(IResourceDelta[] childs, String[] triggers, IProject project) {
		boolean build = false;
		
		for (IResourceDelta child : childs) {
			for (String trigger : triggers) {
				if (child.getFullPath().toString().startsWith(
						"/" + project.getName() + trigger)) {
					build = true;
					break;
				}
			}
			if (build) {
				break;
			}
		}
		return build;
	}

	@Override
	protected void clean(IProgressMonitor monitor) throws CoreException {
		cleanBuild(monitor);
	}

	private void cleanBuild(IProgressMonitor monitor) throws CoreException {
		monitor.subTask("Unify clean process");
		try {
			UnifyBuildHelper.runClean(UnifyBuildHelper
					.getUnifyApplicationProject(getProject()).getLocation());
		} catch (IOException e) {
			throw new CoreException(new Status(Status.ERROR, BUILDER_ID,
					"Python not running", e));
		}
	}

	private void incrementalBuild(IResourceDelta delta, IProgressMonitor monitor)
			throws CoreException {
		delta.accept(new UnifyBuildVisitor(monitor, getProject()));
	}

	private void fullBuild(final IProgressMonitor monitor) throws CoreException {
		MessageConsoleStream msg = UnifyBuildHelper.getConsole()
				.newMessageStream();
		msg.println();
		getProject().accept(new UnifyBuildVisitor(monitor, getProject()));
	}
}
